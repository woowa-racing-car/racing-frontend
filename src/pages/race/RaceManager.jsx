// src/pages/race/RaceManager.jsx
import { createContext, useState, useEffect } from "react";
import { getClient } from "../../stomp/StompClient";
import blueCar from "../../assets/images/bluecar-icon.svg";
import greenCar from "../../assets/images/greencar-icon.svg";
import redCar from "../../assets/images/redcar-icon.svg";
import startFlag from "../../assets/images/race-start-flag.svg";

export const RaceContext = createContext();

export default function RaceManager({ children, room }) {
  const [players, setPlayers] = useState(room?.players || []);
  const [raceCars, setRaceCars] = useState([]);
  const [isReadyToStart, setIsReadyToStart] = useState(true);

  const TRACK_LENGTH = 7000;


  // ----------------------------
  // 유틸
  // ----------------------------
  function chooseImage(carName) {
    if (!carName) return redCar;
    const key = String(carName).toUpperCase();
    if (key.includes("RED")) return redCar;
    if (key.includes("BLUE")) return blueCar;
    if (key.includes("GREEN")) return greenCar;
    return redCar;
  }

  function chooseColor(carName) {
    if (!carName) return "#ff3d3d";
    const key = String(carName).toUpperCase();
    if (key.includes("RED")) return "#ff3d3d";
    if (key.includes("BLUE")) return "#3da4ff";
    if (key.includes("GREEN")) return "#4cff4c";
    return "#ffffff";
  }

  // ----------------------------
  // 안전한 publish
  // ----------------------------
  function safePublish(destination, body = {}, headers = {}, attempt = 0) {
    const MAX_ATTEMPTS = 20;
    const cli = getClient();
    if (!cli || !cli.connected) {
      if (attempt >= MAX_ATTEMPTS) {
        console.warn("[safePublish] giving up:", destination, body);
        return;
      }
      setTimeout(() => safePublish(destination, body, headers, attempt + 1), 200);
      return;
    }

    try {
      if (typeof cli.publish === "function") {
        cli.publish({
          destination,
          body: JSON.stringify(body),
          headers,
        });
      } else if (typeof cli.send === "function") {
        cli.send(destination, headers, JSON.stringify(body));
      } else {
        console.error("[safePublish] no publish/send in client");
      }
    } catch (e) {
      console.error("[safePublish] error", e);
    }
  }

  // ----------------------------
  // 구독 로직
  // ----------------------------
  function subscribeRoomAndTickAndEvent() {
    const client = getClient();
    if (!client) {
      console.warn("[subscribe] no client");
      return () => {};
    }

    const unsubscribers = [];

    try {
      // 1) /sub/room/{roomId}
      const subRoom = client.subscribe(`/sub/room/${room.roomId}`, (msg) => {
        try {
          const body = JSON.parse(msg.body);
          const newPlayers = body.data?.players || [];
          setPlayers(newPlayers);

          setRaceCars((prev) =>
            newPlayers.map((p, idx) => {
              const exist = prev.find((c) => c.memberId === p.memberId);
              return {
                memberId: p.memberId,
                name: p.nickname,
                lane: idx,
                currentX: exist ? exist.currentX : 0,
                targetX: exist ? exist.targetX : 0,
                img: chooseImage(p.car?.name),
                width: 300,
                color: chooseColor(p.car?.name),
              };
            })
          );
        } catch (e) {
          console.warn("[subRoom] parse error", e);
        }
      });
      unsubscribers.push(() => subRoom.unsubscribe());

      // 2) /sub/game/{roomId}/tick 정보 수신
      const subTick = client.subscribe(`/sub/game/${room.roomId}/tick`, (msg) => {
        try {
          const body = JSON.parse(msg.body);
          const statusList = body.data?.gameStatus || [];

          console.log(body);

          setRaceCars((prev) =>
            prev.map((car) => {
              const s = statusList.find((st) => st.memberId === car.memberId);
              if (!s) return car;

              const targetX = (s.carPosition / 100) * TRACK_LENGTH;
              return { ...car, targetX };
            })
          );
        } catch (e) {
          console.warn("[subTick] parse error", e);
        }
      });
      unsubscribers.push(() => subTick.unsubscribe());

      // 3) 게임 이벤트
      const subEvent = client.subscribe(`/sub/game/${room.roomId}/event`, (msg) => {
        try {
          const body = JSON.parse(msg.body);
          const type = body.type;

          if (type === "GAME_STARTED") {
            setIsReadyToStart(false);
          } else if (type === "GAME_FINISHED") {
            console.log("[GAME_FINISHED]", body);
          }
        } catch (e) {
          console.warn("[subEvent] parse error", e);
        }
      });
      unsubscribers.push(() => subEvent.unsubscribe());
    } catch (e) {
      console.warn("subscribeRoomAndTickAndEvent error", e);
    }

    return () => {
      unsubscribers.forEach((u) => {
        try {
          u();
        } catch (e) {}
      });
    };
  }

  // ----------------------------
  // START 버튼
  // ----------------------------
  const onStart = () => {
    setIsReadyToStart(false);
    safePublish("/pub/game/start", { roomId: room.roomId });
  };

  // ----------------------------
  // raceCars 초기화 + 구독
  // ----------------------------
  useEffect(() => {
    const client = getClient();
    if (!room?.roomId) return;

    const initialPlayers = room.players;
    setPlayers(initialPlayers);

    setRaceCars(
      initialPlayers.map((p, idx) => ({
        memberId: p.memberId,
        name: p.nickname,
        lane: idx,
        currentX: 0,
        targetX: 0,
        img: chooseImage(p.car?.name),
        width: 300,
        color: chooseColor(p.car?.name),
      }))
    );

    let cleanupFn = null;

    const doSubscribe = () => {
      if (typeof cleanupFn === "function") cleanupFn();
      cleanupFn = subscribeRoomAndTickAndEvent();
    };

    if (!client) {
      console.warn("[RaceManager] waiting for stomp connect");
      return () => {};
    }

    if (!client.connected) {
      const prev = client.onConnect;
      client.onConnect = (frame) => {
        if (typeof prev === "function") prev(frame);
        doSubscribe();
      };

      return () => {
        if (typeof cleanupFn === "function") cleanupFn();
        client.onConnect = prev;
      };
    }

    doSubscribe();

    return () => {
      if (typeof cleanupFn === "function") cleanupFn();
    };
  }, [room?.roomId]);

  // ----------------------------
  // 애니메이션 루프 (부드러운 이동)
  // ----------------------------
  useEffect(() => {
    let frame;

    const animate = () => {
      setRaceCars((prev) =>
        prev.map((car) => {
          if (car.currentX === car.targetX) return car;

          const diff = car.targetX - car.currentX;
          const newX = car.currentX + diff * 0.15;

          return { ...car, currentX: newX };
        })
      );

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  // ----------------------------
  // 렌더
  // ----------------------------
  return (
    <RaceContext.Provider value={{ raceCars, TRACK_LENGTH }}>
      {isReadyToStart && (
        <img
          src={startFlag}
          onClick={onStart}
          style={{
            position: "absolute",
            right: "40px",
            bottom: "40px",
            width: "150px",
            cursor: "pointer",
            zIndex: 999,
          }}
        />
      )}

      {children}
    </RaceContext.Provider>
  );
}

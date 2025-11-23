// src/pages/room/RoomList.jsx (수정된 주요 부분 전체 파일)
import React, { useEffect, useRef, useState, useMemo, useLayoutEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { connectStomp, getClient } from "../../stomp/StompClient";

import CommonHeader from "../../components/CommonHeader";
import RoomListBackground from "./RoomListBackground";
import RoomListWoodBoard from "./RoomListWoodBoard";
import RoomListCreateButton from "./RoomListCreateButton";
import RoomListItem from "./RoomListItem";

const RoomList = () => {
  const { price } = useParams();
  const navigate = useNavigate();
  const roomTier = price;

  const userName = "유저_아이디";
  const memberId = 1;

  // price가 바뀔 때마다 상태 즉시 초기화 (렌더링 우선)
  const [rooms, setRooms] = useState({});
  const [page, setPage] = useState(0);
  const ITEMS_PER_PAGE = 3;

  const stompClientRef = useRef(null);
  const lastRoomTierRef = useRef(null);
  const subscriptionsSetupRef = useRef(false); // ref로 관리하여 재마운트 시 자동 리셋

  const rawToken = localStorage.getItem("token") || "";
  const token = rawToken.startsWith("Bearer ") ? rawToken.substring(7) : rawToken;

  // price가 바뀔 때마다 상태 즉시 초기화 (렌더링 우선)
  // useEffect로 변경하여 렌더링을 블로킹하지 않음
  useEffect(() => {
    if (lastRoomTierRef.current !== roomTier) {
      setRooms({});
      setPage(0);
      subscriptionsSetupRef.current = false; // roomTier가 바뀔 때 플래그 리셋
      lastRoomTierRef.current = roomTier;
    }
  }, [roomTier]);

  // WebSocket 연결을 비동기로 처리하여 렌더링 블로킹 방지
  useEffect(() => {
    // 구독 ID들을 저장하여 cleanup 시 unsubscribe (함수 밖에서 선언)
    const subscriptions = [];
    let originalOnConnect = null;
    let client = null;

    // 즉시 렌더링을 위해 WebSocket 연결을 다음 틱으로 지연
    const connectWebSocket = () => {
      console.log("%c[WS INIT] Connecting...", "color: yellow; font-weight:bold;");
      const wsUrl = `${import.meta.env.VITE_BASE_URL}/ws?token=${token}&roomTier=${roomTier}`;

      // connectStomp로 연결 (싱글턴)
      client = connectStomp(wsUrl, token, () => {
        console.log("%c[WS CONNECTED]", "color:green;font-weight:bold;");
      });
      stompClientRef.current = client;

      // 구독 설정 함수 (한 번만 실행되도록 보장)
      const setupSubscriptions = () => {
        if (subscriptionsSetupRef.current) {
          console.log("[WS] Subscriptions already setup, skipping");
          return;
        }
        subscriptionsSetupRef.current = true;

        // 전체 방 목록 구독
        const roomsSubPath = `/sub/rooms/${roomTier}`;
        const roomsSub = client.subscribe(roomsSubPath, (message) => {
          const body = JSON.parse(message.body);
          console.log(body);
          setRooms((prev) => ({ ...prev, [roomTier]: body.data.rooms }));
        });
        subscriptions.push(roomsSub);

        // 방 생성 응답
        const createSub = client.subscribe("/user/sub/room/create", (msg) => {
          const body = JSON.parse(msg.body);
          console.log("[ROOM CREATE RESPONSE]", body);
          // 생성된 방으로 바로 입장 UI로 보낼 필요가 있다면 room만 전달
          // replace: true를 사용하여 히스토리에 /rooms/:price를 남기지 않고 /race/:price로 교체
          navigate(`/race/${roomTier}`, { state: { room: body.data }, replace: true });
        });
        subscriptions.push(createSub);

        // 방 입장 응답 (room 데이터만 보냄)
        const joinSub = client.subscribe("/user/sub/room/join", (msg) => {
          const body = JSON.parse(msg.body);
          console.log("[JOIN RESPONSE]", body);
          if (body.type === "ROOM_JOIN_SUCCESS") {
            const room = body.data;
            // client는 절대 state로 전달하지 않음 — RacePage는 getClient()로 직접 가져오거나 StompClient 모듈 사용
            // replace: true를 사용하여 히스토리에 /rooms/:price를 남기지 않고 /race/:price로 교체
            navigate(`/race/${roomTier}`, { state: { room }, replace: true });
          }
        });
        subscriptions.push(joinSub);

        // 에러 응답
        const errorSub = client.subscribe("/user/sub/error", (msg) => {
          console.warn("[WS ERROR MESSAGE]", msg.body);
        });
        subscriptions.push(errorSub);

        // 전체 방 목록 요청
        client.publish({ destination: "/pub/rooms" });
      };

      // onConnect handler 등록 (client가 이미 connect 된 이후에도 onConnect가 호출되므로 안전)
      originalOnConnect = client.onConnect;
      client.onConnect = () => {
        // 기존 핸들러가 있으면 먼저 실행
        if (originalOnConnect) {
          originalOnConnect();
        }
        setupSubscriptions();
      };

      // 이미 연결되어 있으면 즉시 구독 설정
      if (client && client.connected) {
        setupSubscriptions();
      }
    };

    // requestIdleCallback이 있으면 사용, 없으면 setTimeout 사용
    // 렌더링이 완료된 후에 WebSocket 연결하여 화면이 먼저 보이도록 함
    // 더 긴 지연을 주어 렌더링이 완전히 완료된 후에 WebSocket 연결
    const scheduleConnect = window.requestIdleCallback 
      ? window.requestIdleCallback(connectWebSocket, { timeout: 500 })
      : setTimeout(connectWebSocket, 100);

    // cleanup
    return () => {
      if (window.requestIdleCallback && typeof scheduleConnect === 'number') {
        window.cancelIdleCallback(scheduleConnect);
      } else if (typeof scheduleConnect === 'number') {
        clearTimeout(scheduleConnect);
      }
      console.log("%c[WS DISCONNECT]", "color:gray;font-weight:bold;");
      // 모든 구독 해제
      subscriptions.forEach((sub) => {
        try {
          if (sub && typeof sub.unsubscribe === 'function') {
            sub.unsubscribe();
          }
        } catch (e) {
          console.warn("[CLEANUP] unsubscribe error", e);
        }
      });
      // subscriptions 배열 초기화
      subscriptions.length = 0;
      // subscriptionsSetup 플래그 리셋
      subscriptionsSetupRef.current = false;
      // onConnect 핸들러 복원
      if (client && originalOnConnect) {
        client.onConnect = originalOnConnect;
      } else if (client) {
        client.onConnect = undefined;
      }
      // client.deactivate(); // 싱글턴을 다른 페이지에서 쓰면 끊지 말고 필요 시 disconnectStomp() 사용
    };
  }, [roomTier, token, navigate]);

  const handleCreateRoom = () => {
    const client = getClient();
    if (!client || !client.connected) {
      console.log("[ERROR] STOMP not connected");
      return;
    }
    const payload = { memberId, nickname: userName };
    client.publish({ destination: "/pub/room/create", body: JSON.stringify(payload) });
  };

  // pagination render ... (원래 코드와 동일)
  // useMemo로 계산 비용이 큰 작업 최적화
  const roomList = useMemo(() => rooms[roomTier] || [], [rooms, roomTier]);
  const totalPages = useMemo(() => Math.ceil(roomList.length / ITEMS_PER_PAGE), [roomList.length]);
  const startIndex = useMemo(() => page * ITEMS_PER_PAGE, [page]);
  const visibleRooms = useMemo(() => roomList.slice(startIndex, startIndex + ITEMS_PER_PAGE), [roomList, startIndex]);
  const hasPrev = useMemo(() => page > 0, [page]);
  const hasNext = useMemo(() => page < totalPages - 1, [page, totalPages]);
  const coin = 350;

  return (
    <div style={{ position: "fixed", inset: 0, background: "white", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", zIndex: 1000 }}>
      <div style={{ position: "relative", width: "1200px", height: "675px", background: "black", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, width: "100%", zIndex: 30 }}>
          <CommonHeader 
            userName={userName} 
            coin={coin} 
            onBack={() => navigate("/price-entry")}
          />
        </div>

        <RoomListBackground />

        <div style={{ position: "absolute", top: "75px", left: "100px", width: "1000px", height: "570px", zIndex: 20 }}>
          <RoomListWoodBoard>
            <h1 style={{ position: "relative", top: "29px", marginBottom: "15px", color: "#43220c", fontFamily: "Giants", fontSize: "40px", marginLeft: "200px" }}>
              {roomTier}원 방
            </h1>

            <div style={{ position: "relative", marginTop: "90px", height: "420px" }}>
              <div style={{ paddingBottom: "120px" }}>
                {visibleRooms.length === 0 ? (
                  <div style={{ marginTop: "30px", textAlign: "center", fontSize: "24px", color: "#43220c" }}>
                    현재 진행 중인 방이 없습니다.
                  </div>
                ) : (
                  visibleRooms.map((room, i) => (
                    <RoomListItem
                      key={startIndex + i}
                      title={room.title}
                      current={room.currentPlayers}
                      max={room.maxPlayers}
                      status={room.status}
                      onClick={() => {
                        const client = getClient();
                        if (!client || !client.connected) {
                          console.log("[ERROR] STOMP is not connected. Cannot join room.");
                          return;
                        }
                        client.publish({ destination: "/pub/room/join", body: JSON.stringify({ roomId: room.roomId }) });
                      }}
                    />
                  ))
                )}
              </div>

              <div style={{ position: "absolute", bottom: 30, left: 0, width: "100%" }}>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "25px", marginBottom: "10px" }}>
                  <span onClick={() => hasPrev && setPage(page - 1)} style={{ fontSize: "36px", fontWeight: 900, cursor: hasPrev ? "pointer" : "default", opacity: hasPrev ? 1 : 0.3, color: "#43220c" }}>
                    {"<"}
                  </span>
                  <span style={{ fontSize: "28px", fontWeight: 800, color: "#43220c" }}>
                    {totalPages === 0 ? "0 / 0" : `${page + 1} / ${totalPages}`}
                  </span>
                  <span onClick={() => hasNext && setPage(page + 1)} style={{ fontSize: "36px", fontWeight: 900, cursor: hasNext ? "pointer" : "default", opacity: hasNext ? 1 : 0.3, color: "#43220c" }}>
                    {">"}
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "center" }}>
                  <RoomListCreateButton onClick={() => { handleCreateRoom(); /* navigate can be done from server join event instead */ }} />
                </div>
              </div>
            </div>
          </RoomListWoodBoard>
        </div>
      </div>
    </div>
  );
};

export default RoomList;

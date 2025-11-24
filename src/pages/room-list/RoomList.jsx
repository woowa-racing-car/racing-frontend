// src/pages/room/RoomList.jsx (수정된 주요 부분 전체 파일)
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { connectStomp, getClient, getWsUrl } from "../../stomp/StompClient";

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
  // const memberId = 1;

  const [rooms, setRooms] = useState({});
  const [page, setPage] = useState(0);
  const ITEMS_PER_PAGE = 3;

  const subsRef = useRef({});


  const rawToken = localStorage.getItem("token") || "";
  const token = rawToken.startsWith("Bearer ") ? rawToken.substring(7) : rawToken;
  const wsUrl = `${import.meta.env.VITE_BASE_URL}/ws?token=${token}&roomTier=${roomTier}`;

  useEffect(() => {
    const client = getClient();

    // 최초 연결 또는 wsUrl 변경 시
    if (!client || getWsUrl() !== wsUrl) {
      console.log("[STOMP] Connecting...");

      connectStomp(wsUrl, token, () => {
        console.log("[STOMP] connected (fresh)");
        setupSubscriptions();
      });

      return;
    }

    // client는 있으나 아직 연결 안됨
    if (!client.connected) {
      client.onConnect = () => {
        console.log("[STOMP] connected (late)");
        setupSubscriptions();
      };
      return;
    }

    // 이미 연결 완료 상태
    setupSubscriptions();


    function setupSubscriptions() {
      if (subsRef.current.rooms) return; // 중복 방지

      const roomsSubPath = `/sub/rooms/${roomTier}`;

      subsRef.current.rooms = client.subscribe(roomsSubPath, (msg) => {
        const body = JSON.parse(msg.body);
        console.log(`[RECEIVED] ${roomsSubPath}`, body);
        setRooms(prev => ({ ...prev, [roomTier]: body.data.rooms }));
      });

      subsRef.current.create = client.subscribe("/user/sub/room/create", (msg) => {
        const body = JSON.parse(msg.body);
        navigate(`/race/${roomTier}`, { state: { room: body.data } });
      });

      subsRef.current.join = client.subscribe("/user/sub/room/join", (msg) => {
        const body = JSON.parse(msg.body);
        if (body.type === "ROOM_JOIN_SUCCESS") {
          navigate(`/race/${roomTier}`, { state: { room: body.data } });
        }
      });

      subsRef.current.error = client.subscribe("/user/sub/error", (msg) => {
        alert(JSON.parse(msg.body).message);
      });

      // ⬅ 여기서만 pub 실행됨
      console.log("[SEND] /pub/rooms");
      client.publish({ destination: "/pub/rooms" });
    }

    return () => {
      Object.values(subsRef.current).forEach(sub => {
        try { sub.unsubscribe(); } catch {}
      });
      subsRef.current = {};
    };
  }, [roomTier]);

  const handleCreateRoom = () => {
    const client = getClient();
    if (!client || !client.connected) {
      console.log("[ERROR] STOMP not connected");
      return;
    }

    client.publish({ destination: "/pub/room/create" });
    console.log("[SEND] /pub/room/create");
  };

  // pagination render ... (원래 코드와 동일)
  const roomList = rooms[roomTier] || [];
  const totalPages = Math.ceil(roomList.length / ITEMS_PER_PAGE);
  const startIndex = page * ITEMS_PER_PAGE;
  const visibleRooms = roomList.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const hasPrev = page > 0;
  const hasNext = page < totalPages - 1;
  const coin = 350;

  return (
    <div style={{ position: "fixed", inset: 0, background: "white", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ position: "relative", width: "1200px", height: "675px", background: "black", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, width: "100%", zIndex: 30 }}>
          <CommonHeader userName={userName} coin={coin} />
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
                        console.log("[SEND] /pub/room/join roomId: ",room.roomId);
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
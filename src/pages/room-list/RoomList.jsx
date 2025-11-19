import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

import CommonHeader from "../../components/CommonHeader";
import RoomListBackground from "./RoomListBackground";
import RoomListWoodBoard from "./RoomListWoodBoard";
import RoomListCreateButton from "./RoomListCreateButton";
import RoomListItem from "./RoomListItem";

const RoomList = () => {
  const { price } = useParams();
  const roomTier = price;

  const userName = "유저_아이디";
  const memberId = 1; // TODO: 로그인 값

  const [rooms, setRooms] = useState({});
  const [page, setPage] = useState(0);
  const ITEMS_PER_PAGE = 3;

  const stompClientRef = useRef(null);

  // --- 토큰 처리 ---
  const rawToken = localStorage.getItem("token") || "";
  const token = rawToken.startsWith("Bearer ") ? rawToken.substring(7) : rawToken;

  useEffect(() => {
    console.log(
      "%c[WS INIT] Connecting...",
      "color: yellow; font-weight: bold"
    );

    const wsUrl = `${import.meta.env.VITE_BASE_URL}/ws?token=${token}&roomTier=${roomTier}`;
    const socket = new SockJS(wsUrl);

    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (str) => console.log("[STOMP DEBUG]", str),
    });

    client.onConnect = () => {
      console.log(
        "%c[WS CONNECTED] Successfully connected to STOMP",
        "color: #4CAF50; font-weight: bold;"
      );

      // ====== 🔥 1) 전체 방 목록 구독 ======
      const roomsSubPath = `/sub/rooms/${roomTier}`;
      console.log("[SUBSCRIBE] ->", roomsSubPath);
      client.subscribe(roomsSubPath, (message) => {
        console.log("%c[ROOMS RECEIVED]", "color: cyan; font-weight:bold;", message.body);
        const body = JSON.parse(message.body);

        setRooms((prev) => ({
          ...prev,
          [roomTier]: body.data.rooms,
        }));
      });

      // ====== 🔥 2) 방 생성 응답 ======
      const createSub = `/user/sub/room/create`;
      console.log("[SUBSCRIBE] ->", createSub);
      client.subscribe(createSub, (msg) => {
        console.log("%c[CREATE RESPONSE]", "color: orange; font-weight:bold;", msg.body);
      });

      // ====== 🔥 3) 방 입장 응답 ======
      const joinSub = `/user/sub/room/join`;
      console.log("[SUBSCRIBE] ->", joinSub);
      client.subscribe(joinSub, (msg) => {
        console.log("%c[JOIN RESPONSE]", "color: green; font-weight:bold;", msg.body);
      });

      // ====== 🔥 4) 에러 응답 ======
      const errorSub = `/user/sub/error`;
      console.log("[SUBSCRIBE] ->", errorSub);
      client.subscribe(errorSub, (msg) => {
        console.warn("%c[STOMP ERROR MESSAGE]", "color: red; font-weight:bold;", msg.body);
      });

      // ====== 🔥 전체 방 목록 요청 (/pub/rooms) ======
      console.log("[SEND] /pub/rooms");
      client.publish({
        destination: "/pub/rooms", // 🚫 body 없어야 함!!
      });
    };


    client.onStompError = (frame) => {
      console.error("[STOMP ERROR]", frame.headers["message"]);
      console.error("Details:", frame.body);
    };

    client.onWebSocketClose = () => {
      console.log("%c[WS CLOSED]", "color:red; font-weight:bold;");
    };

    client.activate();
    stompClientRef.current = client;

    return () => {
      console.log("%c[WS DISCONNECT]", "color: gray; font-weight:bold;");
      client.deactivate();
    };
  }, [roomTier]);

  // --- 방 생성 요청 SEND ---
  const handleCreateRoom = () => {
    if (!stompClientRef.current || !stompClientRef.current.connected) {
      console.log("[ERROR] STOMP is not connected. Cannot create room.");
      return;
    }

    const payload = {
      memberId: memberId,
      nickname: userName,
    };

    console.log("[SEND] /pub/room/create ->", payload);

    stompClientRef.current.publish({
      destination: "/pub/room/create",
      body: JSON.stringify(payload),
    });
  };

  // --- 페이지네이션 ---
  const roomList = rooms[roomTier] || [];
  const totalPages = Math.ceil(roomList.length / ITEMS_PER_PAGE);
  const startIndex = page * ITEMS_PER_PAGE;
  const visibleRooms = roomList.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const hasPrev = page > 0;
  const hasNext = page < totalPages - 1;

  const coin = 350;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "1200px",
          height: "675px",
          background: "black",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            width: "100%",
            zIndex: 30,
          }}
        >
          <CommonHeader userName={userName} coin={coin} />
        </div>

        <RoomListBackground />

        <div
          style={{
            position: "absolute",
            top: "75px",
            left: "100px",
            width: "1000px",
            height: "570px",
            zIndex: 20,
          }}
        >
          <RoomListWoodBoard>
            <h1
              style={{
                position: "relative",
                top: "29px",
                marginBottom: "15px",
                color: "#43220c",
                fontFamily: "Giants",
                fontSize: "40px",
                marginLeft: "200px",
              }}
            >
              {roomTier}원 방
            </h1>

            <div
              style={{
                position: "relative",
                marginTop: "90px",
                height: "420px",
              }}
            >
              <div
                style={{
                  paddingBottom: "120px",
                }}
              >
                {visibleRooms.length === 0 ? (
                  <div
                    style={{
                      marginTop: "30px",
                      textAlign: "center",
                      fontSize: "24px",
                      color: "#43220c",
                    }}
                  >
                    현재 진행 중인 방이 없습니다.
                  </div>
                ) : (
                  visibleRooms.map((room, i) => (
                    <RoomListItem
                      key={startIndex + i}
                      title={room.title}
                      current={room.currentPlayers}   // 🔥 수정
                      max={room.maxPlayers}           // 🔥 수정
                      status={room.status}
                      onClick={() => {
                        console.log(`[CLICK] 방 입장: ${room.title}`);
                      }}
                    />
                  ))
                )}
              </div>

              <div
                style={{
                  position: "absolute",
                  bottom: 30,
                  left: 0,
                  width: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "25px",
                    marginBottom: "10px",
                  }}
                >
                  <span
                    onClick={() => {
                      if (hasPrev) {
                        console.log("[PAGING] Prev page");
                        setPage(page - 1);
                      }
                    }}
                    style={{
                      fontSize: "36px",
                      fontWeight: "900",
                      cursor: hasPrev ? "pointer" : "default",
                      opacity: hasPrev ? 1 : 0.3,
                      color: "#43220c",
                      userSelect: "none",
                    }}
                  >
                    {"<"}
                  </span>

                  <span
                    style={{
                      fontSize: "28px",
                      fontWeight: "800",
                      color: "#43220c",
                    }}
                  >
                    {totalPages === 0 ? "0 / 0" : `${page + 1} / ${totalPages}`}
                  </span>

                  <span
                    onClick={() => {
                      if (hasNext) {
                        console.log("[PAGING] Next page");
                        setPage(page + 1);
                      }
                    }}
                    style={{
                      fontSize: "36px",
                      fontWeight: "900",
                      cursor: hasNext ? "pointer" : "default",
                      opacity: hasNext ? 1 : 0.3,
                      color: "#43220c",
                      userSelect: "none",
                    }}
                  >
                    {">"}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <RoomListCreateButton
                    onClick={() => {
                      console.log("[CLICK] 방 생성 버튼 클릭");
                      handleCreateRoom();
                    }}
                  />
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

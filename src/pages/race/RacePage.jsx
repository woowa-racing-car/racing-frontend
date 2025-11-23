// src/pages/race/RacePage.jsx
import { useParams, useLocation, useNavigate } from "react-router-dom";
import RaceManager from "./RaceManager";
import RaceTrack from "./RaceTrack";
import CommonHeader from "../../components/CommonHeader";
import { useEffect, useRef } from "react";
import { getClient, connectStomp } from "../../stomp/StompClient";

export default function RacePage() {
  const { price } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const joinedRoom = location.state?.room;
  const leaveSent = useRef(false); // ⭐ leave 중복 발송 방지용
  const firstCleanup = useRef(true); // ⭐ StrictMode cleanup 방지용
  const prevRoomIdRef = useRef(null);

  const roomId = joinedRoom?.roomId;

  // roomId가 바뀔 때마다 ref 리셋
  useEffect(() => {
    if (roomId !== prevRoomIdRef.current) {
      leaveSent.current = false;
      firstCleanup.current = true;
      prevRoomIdRef.current = roomId;
    }
  }, [roomId]);

  if (joinedRoom === undefined) {
    return null;
  }

  if (!joinedRoom) {
    return <div style={{ color: "white" }}>방 정보가 없습니다.</div>;
  }

  // ======================================================
  // (1) 페이지 떠날 때 /pub/room/leave (완전 안정 버전)
  // ======================================================

  useEffect(() => {
    if (!roomId) return;

    const client = getClient();

    const sendLeave = () => {
      if (leaveSent.current) return;
      if (client && client.connected) {
        client.publish({
          destination: "/pub/room/leave",
          body: JSON.stringify({ roomId })
        });
        console.log("[LEAVE SENT] roomId:", roomId);
      }
      leaveSent.current = true;
    };

    const handleBeforeUnload = () => sendLeave();
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      // ⭐ StrictMode의 첫 cleanup만 무시
      if (firstCleanup.current) {
        firstCleanup.current = false;
        return;
      }

      // ⭐ 실제로 페이지 떠날 때만 leave 실행됨
      // 비동기로 처리하여 navigate를 블로킹하지 않음
      setTimeout(() => {
        sendLeave();
      }, 0);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [location.pathname, roomId]);


  // ======================================================
  // (2) Stomp 재연결 (새로고침 대비)
  // ======================================================
  useEffect(() => {
    if (!joinedRoom) return;

    const client = getClient();
    if (!client) {
      const rawToken = localStorage.getItem("token") || "";
      const token = rawToken.startsWith("Bearer ")
        ? rawToken.substring(7)
        : rawToken;

      const wsUrl = `${import.meta.env.VITE_BASE_URL}/ws?token=${token}&roomTier=${price}`;
      connectStomp(wsUrl, token, () => {
        console.log("[STOMP] reconnected from RacePage");
      });
    }
  }, [joinedRoom, price]);

  const client = getClient();

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 900
      }}
    >
      <div
        style={{
          position: "relative",
          width: "1200px",
          height: "675px",
          overflow: "hidden",
          background: "black"
        }}
      >
        <CommonHeader
          userName={
            joinedRoom.players?.find(
              (p) => p.memberId === Number(joinedRoom.hostId)
            )?.nickname || "유저"
          }
          coin={1200}
          onBack={() => {
            // 항상 해당 가격대의 /rooms/:price로 명시적 이동
            // replace: false로 하여 히스토리에 남기고, 즉시 이동 보장
            navigate(`/rooms/${price}`, { replace: false });
          }}
        />

        <RaceManager client={client} room={joinedRoom}>
          <RaceTrack />
        </RaceManager>
      </div>
    </div>
  );
}

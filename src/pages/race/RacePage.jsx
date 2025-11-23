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

  // 경로가 /race/로 시작하지 않으면 즉시 렌더링하지 않음
  // 브라우저 뒤로 가기 시 React Router가 다른 컴포넌트를 렌더링하도록 함
  if (!location.pathname.startsWith("/race/")) {
    return null;
  }

  const joinedRoom = location.state?.room;
  const leaveSent = useRef(false); // ⭐ leave 중복 발송 방지용

  // location.state가 없으면 (뒤로 가기 등) 룸 리스트로 리다이렉트
  useEffect(() => {
    if (location.pathname.startsWith("/race/") && joinedRoom === undefined && price) {
      navigate(`/rooms/${price}`, { replace: true });
    }
  }, [location.pathname, joinedRoom, navigate, price]);

  if (joinedRoom === undefined) {
    return null;
  }

  if (!joinedRoom) {
    return <div style={{ color: "white" }}>방 정보가 없습니다.</div>;
  }

  const roomId = joinedRoom?.roomId;

  // ======================================================
  // (1) 페이지 떠날 때 /pub/room/leave (완전 안정 버전)
  // ======================================================
  const firstCleanup = useRef(true);

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
      sendLeave();
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
        justifyContent: "center"
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
        />

        <RaceManager client={client} room={joinedRoom}>
          <RaceTrack />
        </RaceManager>
      </div>
    </div>
  );
}

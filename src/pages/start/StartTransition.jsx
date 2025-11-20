import { useNavigate } from "react-router-dom";
import video from "../../assets/videos/racing.mp4";

export default function StartTransition() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#ffffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* 🔥 콘텐츠 박스 (게임 화면 비율 유지) */}
      <div
        style={{
          position: "relative",
          width: "1200px",
          height: "675px",
          overflow: "hidden",
          background: "black",
        }}
      >
        <video
          src={video}
          autoPlay
          muted
          onEnded={() => navigate("/price-entry")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>
    </div>
  );
}

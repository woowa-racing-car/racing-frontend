import { useNavigate } from "react-router-dom";
import { useState } from "react";
import video from "../../assets/videos/introVideo.mp4";

export default function IntroPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "1200px",
          height: "675px",
          overflow: "hidden",
        }}
      >
        {!ready && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "#ffffff",
              zIndex: 2,
            }}
          />
        )}

        <video
          src={video}
          autoPlay
          muted
          playsInline
          onLoadedData={() => setReady(true)}
          onEnded={() => navigate("/start")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: ready ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        />
      </div>
    </div>
  );
}

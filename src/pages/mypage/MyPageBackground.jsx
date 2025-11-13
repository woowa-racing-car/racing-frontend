import React from "react";
import mypageBg from "../../assets/images/mypage-background.svg";
import light from "../../assets/images/mypage-light.svg";

export default function MyPageBackground() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `url(${mypageBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        overflow: "hidden",
      }}
    >

      <img
        src={light}
        alt="light"
        style={{
          position: "absolute",
          top: "50%",
          left: "43%",
          transform: "translate(-50%, -50%) scale(0.65)", 
          width: "auto",
          height: "auto",
          zIndex: 2,
          opacity: 0,
          animation: "lightBlink 0.6s ease-out 0s 2",
          pointerEvents: "none",
        }}
      />

      <style>
        {`
          @keyframes lightBlink {
            0% { opacity: 0; }
            40% { opacity: 1; }
            100% { opacity: 0; }
          }
        `}
      </style>
    </div>
  );
}

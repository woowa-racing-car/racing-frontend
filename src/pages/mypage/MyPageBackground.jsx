import React from "react";
import mypageBg from "../../assets/images/mypage-background.svg";

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
        zIndex: 0,
      }}
    />
  );
}

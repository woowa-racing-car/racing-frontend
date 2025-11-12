import React from "react";
import titleImg from "../../assets/images/main-title.svg";

export default function MainTitle() {
  return (
    <img
      src={titleImg}
      alt="main title"
      className="fade-item"
      style={{
        position: "absolute",
        top: "155px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "700px",
        zIndex: 10,
      }}
    />
  );
}

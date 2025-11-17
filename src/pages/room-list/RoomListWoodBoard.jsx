import React from "react";
import woodImg from "../../assets/images/roomlist-woodboard.svg";

const RoomListWoodBoard = ({ children, style }) => {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      <img
        src={woodImg}
        alt="Room WoodBoard"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "contain",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          height: "100%",
          ...style,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default RoomListWoodBoard;

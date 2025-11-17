import React from "react";
import itemBG from "../../assets/images/roomlist-item.svg";

const RoomListItem = ({ title, current, max, status, onClick }) => {
  const isWaiting = status === "WAITING";

  return (
    <div
      onClick={onClick}
      style={{
        position: "relative",
        width: "75%",
        margin: "0 auto",

        marginTop: "8px",
        marginBottom: "0px",

        height: "70px",
        cursor: "pointer",
        zIndex: 2,
      }}
    >
      <img
        src={itemBG}
        alt="방 리스트 배경"
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
          zIndex: 3,
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "flex-start",
          gap: "12px",
          alignItems: "center",

          padding: "0 125px",

          color: "#4a2a0c",
          fontWeight: "700",
        }}
      >
        <span style={{ fontSize: "20px" }}>
          {title} [{current}/{max}]
        </span>

        <span
          style={{
            fontSize: "16px",
            background: isWaiting ? "#2d8a3f" : "#c0392b",
            color: "white",
            padding: "6px 16px",
            borderRadius: "16px",
            fontWeight: "600",
            whiteSpace: "nowrap",
          }}
        >
          {isWaiting ? "대기중" : "진행 중"}
        </span>
      </div>
    </div>
  );
};

export default RoomListItem;

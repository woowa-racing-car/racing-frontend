import React from "react";
import itemBG from "../../assets/images/roomlist-item.svg";

const RoomListItem = ({ title, current, max, status, onClick }) => {
  const isWaiting = status === "WAITING";

  return (
    <div
      onClick={onClick}
      style={{
        position: "relative",
        width: "100%",
        height: "90px",
        marginBottom: "15px",
        cursor: "pointer",
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
          pointerEvents: "none",
          userSelect: "none",
        }}
      />


      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 40px",
          color: "#4a2a0c",
          fontWeight: "700",
        }}
      >
       
        <span style={{ fontSize: "26px" }}>
          {title} [{current}/{max}]
        </span>
    
        <span
          style={{
            fontSize: "22px",
            background: isWaiting ? "#2d8a3f" : "#c0392b",
            color: "white",
            padding: "8px 22px",
            borderRadius: "20px",
            fontWeight: "600",
          }}
        >
          {isWaiting ? "대기중" : "진행 중"}
        </span>
      </div>
    </div>
  );
};

export default RoomListItem;

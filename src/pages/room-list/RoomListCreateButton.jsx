import React from "react";
import btnImg from "../../assets/images/roomlist-createbutton.svg";

const RoomListCreateButton = ({ onClick, style }) => {
  return (
    <img
      src={btnImg}
      alt="방 만들기 버튼"
      onClick={onClick}
      style={{
        cursor: "pointer",
        width: "300px",
        userSelect: "none",
        zIndex: 3,
        ...style,
      }}
    />
  );
};

export default RoomListCreateButton;

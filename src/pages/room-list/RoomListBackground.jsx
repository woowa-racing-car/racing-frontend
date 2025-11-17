import React from "react";
import bg from "../../assets/images/roomlist-background.svg";

const RoomListBackground = () => {
  return (
    <img
      src={bg}
      alt="Room List Background"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        zIndex: 1,
      }}
    />
  );
};

export default RoomListBackground;

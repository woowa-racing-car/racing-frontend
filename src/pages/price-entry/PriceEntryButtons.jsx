import React from "react";
import { useNavigate } from "react-router-dom";
import btn100 from "../../assets/images/price-entry-100button.svg";
import btn500 from "../../assets/images/price-entry-500button.svg";
import btn1000 from "../../assets/images/price-entry-1000button.svg";

const PriceEntryButtons = () => {
  const navigate = useNavigate();

  const goToRoomList = (price) => {
    navigate(`/rooms/${price}`);
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        right: "80px",
        transform: "translateY(-50%)",
        display: "flex",
        flexDirection: "column",
        gap: "5px",
        zIndex: 15,
      }}
    >
      <img
        src={btn100}
        alt="100원 입장"
        style={{ width: "350px", cursor: "pointer" }}
        onClick={() => goToRoomList(100)}
      />

      <img
        src={btn500}
        alt="500원 입장"
        style={{ width: "350px", cursor: "pointer" }}
        onClick={() => goToRoomList(500)}
      />

      <img
        src={btn1000}
        alt="1000원 입장"
        style={{ width: "350px", cursor: "pointer" }}
        onClick={() => goToRoomList(1000)}
      />
    </div>
  );
};

export default PriceEntryButtons;

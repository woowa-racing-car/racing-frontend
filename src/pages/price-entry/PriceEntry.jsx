import React, { useState } from "react";
import PriceEntryBackground from "./PriceEntryBackground";
import PriceEntryButtons from "./PriceEntryButtons";
import CommonHeader from "../../components/CommonHeader";

const PriceEntry = () => {
  const [coin, setCoin] = useState(350);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "1200px",
          height: "675px",
          background: "black",
          overflow: "hidden",
        }}
      >
        
        <div
          style={{
            position: "absolute",
            top: 0,
            width: "100%",
            zIndex: 20,
          }}
        >
          <CommonHeader userName="유저_아이디" coin={coin} />
        </div>

   <PriceEntryBackground />
        <PriceEntryButtons />
      </div>
    </div>
  );
};

export default PriceEntry;

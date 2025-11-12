import React from "react";
import bgUrl from "../../assets/images/main-background.svg";

export default function MainBackground() {
  return (
    <img
      src={bgUrl}
      alt="main background"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
    />
  );
}

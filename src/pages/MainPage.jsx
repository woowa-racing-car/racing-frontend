import React from "react";
import MainFadeStyle from "./main/MainFadeStyle";
import MainBackground from "./main/MainBackground";
import MainTitle from "./main/MainTitle";
import MainSignboard from "./main/MainSignboard";


export default function MainPage() {
  return (
    <>
      <MainFadeStyle />
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
          <MainBackground />
          <MainTitle />
          <MainSignboard />
        </div>
      </div>
    </>
  );
}

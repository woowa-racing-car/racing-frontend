import React from "react";
import bgUrl from "../assets/images/main-background.svg";
import titleImg from "../assets/images/main-title.svg";

export default function MainPage() {
  return (
    <>
      <style>
        {`
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateX(-50%) translateY(20px); }
            100% { opacity: 1; transform: translateX(-50%) translateY(0); }
          }

          .title-fade {
            animation: fadeIn 1.2s ease-out forwards;
          }
        `}
      </style>

      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "white",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem"
        }}
      >
        <div
          style={{
            position: "relative",
            width: "1200px",
            height: "675px",
            maxWidth: "calc(100vw - 4rem)",
            maxHeight: "calc(100vh - 4rem)",
            aspectRatio: "16/9",
            background: "black",
            overflow: "hidden"
          }}
        >
          <img
            src={bgUrl}
            alt="background"
            draggable={false}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              pointerEvents: "none",
              userSelect: "none",
              zIndex: 0
            }}
          />

          <img
            src={titleImg}
            alt="title"
            draggable={false}
            className="title-fade"
            style={{
              position: "absolute",
              top: "190px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "600px",
              objectFit: "contain",
              pointerEvents: "none",
              userSelect: "none",
              opacity: 0,      
              zIndex: 9999
            }}
          />

          <div style={{ position: "relative", width: "100%", height: "100%" }} />
        </div>
      </div>
    </>
  );
}

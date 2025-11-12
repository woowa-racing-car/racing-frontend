import React from "react";
import MyPageBackground from "./MyPageBackground";

export default function MyPage() {
  return (
    <>
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
       
          <MyPageBackground />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "white",
              textAlign: "center",
            }}
          >
          </div>
        </div>
      </div>
    </>
  );
}

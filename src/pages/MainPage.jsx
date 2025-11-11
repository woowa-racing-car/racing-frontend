import React from "react";
import bgUrl from "../assets/images/main-background.svg";
import titleImg from "../assets/images/main-title.svg";
import signboardImg from "../assets/images/main-signboard.svg";
import joinImg from "../assets/images/main-join.svg";
import loginImg from "../assets/images/main-login.svg";

export default function MainPage() {
  return (
    <>
      <style>
        {`
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateX(-50%) translateY(20px); }
            100% { opacity: 1; transform: translateX(-50%) translateY(0); }
          }
          .fade-item {
            opacity: 0;
            animation: fadeIn 1.2s ease-out forwards;
          }
        `}
      </style>

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
          <img
            src={bgUrl}
            alt="background"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

          <img
            src={titleImg}
            alt="title"
            className="fade-item"
            style={{
              position: "absolute",
              top: "155px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "700px",
              zIndex: 10,
            }}
          />

          <div
            className="fade-item"
            style={{
              position: "absolute",
              top: "60%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "500px",
              height: "250px",
              backgroundImage: `url(${signboardImg})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              zIndex: 20,
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: "48%",
                  transform: "translateX(-50%)",
                  top: 60,
                  width: "67%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  fontFamily: "Giants-Regular",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <label
                    style={{
                      width: "70px",
                      fontSize: "17px",
                      color: "#5A2E00",
                      fontFamily: "Giants-Regular",
                    }}
                  >
                    아이디
                  </label>
                  <input
                    type="text"
                    style={{
                      flex: 1,
                      height: "34px",
                      background: "#E5D3B8",
                      border: "none",
                      borderRadius: "6px",
                      padding: "0 8px",
                      fontSize: "15px",
                      outline: "none",
                      fontFamily: "Giants-Regular",
                    }}
                  />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <label
                    style={{
                      width: "70px",
                      fontSize: "17px",
                      color: "#5A2E00",
                      fontFamily: "Giants-Regular",
                    }}
                  >
                    비밀번호
                  </label>
                  <input
                    type="password"
                    style={{
                      flex: 1,
                      height: "34px",
                      background: "#E5D3B8",
                      border: "none",
                      borderRadius: "6px",
                      padding: "0 8px",
                      fontSize: "15px",
                      outline: "none",
                      fontFamily: "Giants-Regular",
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  position: "absolute",
                  left: 90,
                  bottom: 40,
                  display: "flex",
                  gap: "30px",
                }}
              >
                <img
                  src={loginImg}
                  alt="login"
                  style={{
                    width: "140px",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                />
                <img
                  src={joinImg}
                  alt="join"
                  style={{
                    width: "140px",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

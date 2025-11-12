import React, { useState } from "react";
import signboardImg from "../../assets/images/main-signboard.svg";
import joinImg from "../../assets/images/main-join.svg";
import loginImg from "../../assets/images/main-login.svg";
import MainInput from "./MainInput";

export default function MainSignboard() {
  const [mode, setMode] = useState("login"); // 'login' or 'join'

  const handleLoginClick = () => setMode("login");
  const handleJoinClick = () => setMode("join");

  return (
    <div
      className="fade-item"
      style={{
        position: "absolute",
        top: "57%", // ✅ 60% → 57%로 조정
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: mode === "join" ? "590px" : "500px",
        height: mode === "join" ? "300px" : "250px",
        backgroundImage: `url(${signboardImg})`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        zIndex: 20,
      }}
    >
      {/* 입력창 영역 */}
      <div
        style={{
          position: "absolute",
          left: "48%",
          transform: "translateX(-50%)",
          top: mode === "join" ? 56 : 60,
          width: "67%",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          fontFamily: "Giants-Regular",
        }}
      >
        {mode === "login" ? (
          <>
            <MainInput label="아이디" type="text" />
            <MainInput label="비밀번호" type="password" />
          </>
        ) : (
          <>
            <MainInput label="닉네임" type="text" />
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <MainInput label="아이디" type="text" flexGrow />
              <button
                style={{
                  background: "#D28B35",
                  border: "none",
                  borderRadius: "6px",
                  height: "36px",
                  padding: "0 14px",
                  minWidth: "60px",
                  fontSize: "14px",
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                  fontFamily: "Giants-Regular",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                중복확인
              </button>
            </div>
            <MainInput label="비밀번호" type="password" />
          </>
        )}
      </div>

      {/* 로그인 / 회원가입 버튼 */}
      <div
        style={{
          position: "absolute",
          left: mode === "join" ? 120 : 80, // 👈 회원가입 모드일 때 약간 오른쪽으로 이동
          bottom: mode === "join" ? 55 : 40,
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
            opacity: mode === "login" ? 1 : 0.6,
            transition: "opacity 0.2s ease",
          }}
          onClick={handleLoginClick}
        />
        <img
          src={joinImg}
          alt="join"
          style={{
            width: "140px",
            cursor: "pointer",
            userSelect: "none",
            opacity: mode === "join" ? 1 : 0.6,
            transition: "opacity 0.2s ease",
          }}
          onClick={handleJoinClick}
        />
      </div>
    </div>
  );
}

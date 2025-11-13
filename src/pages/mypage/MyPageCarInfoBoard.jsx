import React from "react";

import skillBomb from "../../assets/images/skill-bom.svg";
import skillShield from "../../assets/images/skill-shield.svg";
import skillWheel from "../../assets/images/skill-wheel.svg";

export default function MyPageCarInfoBoard({ car, infoBoxImg }) {
  return (
    <div
      style={{
        position: "absolute",
        right: "2px",
        top: "150px",

        width: "420px",
        height: "480px",

        backgroundImage: `url(${infoBoxImg})`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",

        padding: "80px 50px",
        color: "white",
        zIndex: 9,

        transform: "rotate(10deg)",
      }}
    >
   
      <div
        style={{
          transform: "rotate(1deg) translateX(30px) translateY(20px) scale(0.9)",

        }}
      >
        <h2
          style={{
            fontSize: "32px",
            fontWeight: "900",
            margin: 0,
            color: "#ff3333",
          }}
        >
          {car.name}
        </h2>

        <p
          style={{
            fontSize: "20px",
            marginTop: "6px",
            fontWeight: "600",
            color: "#555",
          }}
        >
          speed {car.speed}
        </p>

        <div
          style={{
            width: "75%",
            height: "12px",
            marginTop: "5px",
            borderRadius: "10px",
            background: "#ffeaa7",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${car.speed * 7}%`,
              height: "100%",
              borderRadius: "10px",
              background: "linear-gradient(to right, #ff4d4d, #ffdb55)",
            }}
          ></div>
        </div>

        <div
          style={{
            width: "80%",
            height: "3px",
            background: "#f4d97b",
            margin: "18px 0 8px 0",
            borderRadius: "2px",
          }}
        />

        <p
          style={{
            fontSize: "30px",
            fontWeight: "800",
            color: "#ff4444",
            marginBottom: "10px",
          }}
        >
          Skill
        </p>

    
        <div
          style={{
            display: "flex",
            gap: "15px",
            marginTop: "5px",
            paddingLeft: "5px",
          }}
        >
          <img src={skillBomb} alt="bomb" style={{ width: "70px", height: "70px" }} />
          <img src={skillShield} alt="shield" style={{ width: "70px", height: "70px" }} />
          <img src={skillWheel} alt="wheel" style={{ width: "70px", height: "70px" }} />
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";

import MyPageBackground from "./MyPageBackground";
import MyPageCarList from "./MyPageCarList";
import MyPageCarDisplay from "./MyPageCarDisplay";
import MyPageCarInfoBoard from "./MyPageCarInfoBoard";

import CommonHeader from "../../components/CommonHeader";

// 자동차 이미지 import
import redCarImg from "../../assets/images/mypage-redcar.svg";
import blueCarImg from "../../assets/images/mypage-bluecar.svg";
import greenCarImg from "../../assets/images/mypage-greencar.svg";

// 자동차 정보판 이미지 (있다면 사용)
import infoBoxImg from "../../assets/images/mypage-carinfobox.svg";

export default function MyPage() {
  const [selectedCar, setSelectedCar] = useState("red");

  const cars = {
    red: {
      name: "Red Car",
      speed: 10,
      img: redCarImg,
      locked: false,
    },
    blue: {
      name: "Blue Car",
      speed: 12,
      img: blueCarImg,
      locked: true,
    },
    green: {
      name: "Green Car",
      speed: 14,
      img: greenCarImg,
      locked: true,
    },
  };

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
        <CommonHeader userName="홍길동" coin={350} />

        <MyPageBackground />

        <MyPageCarList
          cars={cars}
          selectedCar={selectedCar}
          onSelect={setSelectedCar}
        />

        <MyPageCarDisplay carImage={cars[selectedCar].img} />

        <MyPageCarInfoBoard 
          car={cars[selectedCar]} 
          infoBoxImg={infoBoxImg}
        />
      </div>
    </div>
  );
}

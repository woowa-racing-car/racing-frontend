import React, { useState } from "react";

import MyPageBackground from "./MyPageBackground";
import MyPageCarList from "./MyPageCarList";
import MyPageCarDisplay from "./MyPageCarDisplay";
import MyPageCarInfoBoard from "./MyPageCarInfoBoard";

import CommonHeader from "../../components/CommonHeader";

import redCarImg from "../../assets/images/mypage-redcar.svg";
import blueCarImg from "../../assets/images/mypage-bluecar.svg";
import greenCarImg from "../../assets/images/mypage-greencar.svg";
import infoBoxImg from "../../assets/images/mypage-carinfobox.svg";

export default function MyPage() {
  const [selectedCar, setSelectedCar] = useState("red");
  const [coin, setCoin] = useState(350);

  const [cars, setCars] = useState({
    red: {
      id: "red",
      name: "Red Car",
      speed: 10,
      img: redCarImg,
      locked: false,
    },
    blue: {
      id: "blue",   
      name: "Blue Car",
      speed: 12,
      img: blueCarImg,
      locked: true,
    },
    green: {
      id: "green",  
      name: "Green Car",
      speed: 14,
      img: greenCarImg,
      locked: true,
    },
  });

  const handleCarSelect = (id) => {
    const car = cars[id];

    if (car.locked) {
      if (coin < 5) {
        alert("코인이 부족합니다!");
        return;
      }

      const buy = window.confirm(`${car.name}을(를) 5코인으로 구매하시겠습니까?`);
      if (!buy) return;

      setCoin((prev) => prev - 5);
      setCars((prev) => ({
        ...prev,
        [id]: { ...prev[id], locked: false },
      }));
    }

    setSelectedCar(id);
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
        <CommonHeader userName="유저_아이디" coin={coin} />

        <MyPageBackground />

        <MyPageCarList
          cars={cars}
          selectedCar={selectedCar}
          onSelect={handleCarSelect}
        />

        <MyPageCarDisplay 
  carId={selectedCar}  
  carImage={cars[selectedCar].img}
/>


        <MyPageCarInfoBoard 
          car={cars[selectedCar]} 
          infoBoxImg={infoBoxImg}
        />
      </div>
    </div>
  );
}

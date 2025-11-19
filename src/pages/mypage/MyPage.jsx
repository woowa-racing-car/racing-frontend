import React, { useState, useEffect } from "react";
import axios from "axios";

import MyPageBackground from "./MyPageBackground";
import MyPageCarList from "./MyPageCarList";
import MyPageCarDisplay from "./MyPageCarDisplay";
import MyPageCarInfoBoard from "./MyPageCarInfoBoard";

import CommonHeader from "../../components/CommonHeader";

import redCarImg from "../../assets/images/mypage-redcar.svg";
import blueCarImg from "../../assets/images/mypage-bluecar.svg";
import greenCarImg from "../../assets/images/mypage-greencar.svg";
import infoBoxImg from "../../assets/images/mypage-carinfobox.svg";

const CAR_KEY_MAP = {
  RED: "red",
  BLUE: "blue",
  GREEN: "green",
};

const CAR_ID_MAP={
  red:1,
  blue:2,
  green:3,
}

const CAR_IMAGES = {
  red: redCarImg,
  blue: blueCarImg,
  green: greenCarImg,
};

export default function MyPage() {
  const [username, setUsername] = useState("");
  const [selectedCar, setSelectedCar] = useState(null);
  const [coin, setCoin] = useState(0);
  const [cars, setCars] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/v1/mypage`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        console.log(token);

        const data = res.data.data;

        setUsername(data.username);
        setCoin(data.money);

        const mappedCars = {};
        let selectedKey = null;

        data.cars.forEach((car) => {
          const key = CAR_KEY_MAP[car.name];
          const car_id=CAR_ID_MAP[car.name.toLowerCase()];

          mappedCars[key] = {
            car_id:car_id,
            id: key,
            name: car.name,
            speed: car.speed,
            img: CAR_IMAGES[key],
            locked: !car.isPurchased,
          };

          if (car.isSelected) {
            selectedKey = key;
          }
        });

        if (!selectedKey) selectedKey = "red";

        setCars(mappedCars);
        setSelectedCar(selectedKey);
      } catch (err) {
        console.error("데이터 로딩 실패:", err);
      }
    };

    fetchData();
  }, []);

  const handleCarSelect = async (id) => {
    const car = cars[id];

    const carId=car.car_id;

    console.log(carId);

    try{
      const token =localStorage.getItem("token");

      const res=await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/mypage/select/${carId}`,null,
        {headers:{Authorization:`${token}`}}
      );

      const data=res.data.data;

      if(!data.isPurchased){
        const ok = window.confirm(`${id.toUpperCase()} 자동차를 ${data.price}코인으로 구매하시겠습니까?`);
      if(!ok) return;

      const buyRes=await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/mypage/purchase/${carId}`,null,
        {headers:{Authorization:`${token}`}}
      );

      const buyData=buyRes.data.data;
      
      setCoin(buyData.currentMoney);
      setCars((prev)=>({
        ...prev,
        [id]:{
          ...prev[id],
          locked:false,
        },
      }));

      setSelectedCar(id);
      return;
    }

    setSelectedCar(id);

    setCars((prev)=>({
      ...prev,
      [id]:{
        ...prev[id],
        locked:!data.isPurchased,
      },
    }));
  } catch(err){
    console.log(err.response?.data.reason);
    const msg=err.response?.data.reason;
    alert(msg);
  }

  return;
};

  const currentCar = selectedCar ? cars[selectedCar] : null;

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
        <CommonHeader userName={username} coin={coin} />

        <MyPageBackground />

        <MyPageCarList
          cars={cars}
          selectedCar={selectedCar}
          onSelect={handleCarSelect}
        />

        {currentCar && (
          <MyPageCarDisplay carId={currentCar.id} carImage={currentCar.img} />
        )}

        {currentCar && (
          <MyPageCarInfoBoard car={currentCar} infoBoxImg={infoBoxImg} />
        )}
      </div>
    </div>
  );
}

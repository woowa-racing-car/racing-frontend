import React, { useEffect, useRef, useState } from "react";

export default function MyPageCarDisplay({ carImage, carId }) {
  const carRef = useRef(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true); 

  const carStyleMap = {
    red: { width: 1300, left: "11%", bottom: "25px" },
    blue: { width: 1300, left: "3%", bottom: "40px" },
    green: { width: 1350, left: "16%", bottom: "34px" },
  };

  const carStyle = carStyleMap[carId] || carStyleMap.red;

  useEffect(() => {
    if (!carRef.current) return;

    carRef.current.style.opacity = 0;

    const delay = isFirstLoad ? 1250 : 50;

    const timer = setTimeout(() => {
      if (carRef.current) carRef.current.style.opacity = 1;
    }, delay);
    if (isFirstLoad) setIsFirstLoad(false);

    return () => clearTimeout(timer);
  }, [carId, carImage]);

  return (
    <div
      ref={carRef}
      style={{
        position: "absolute",
        zIndex: 8,

        left: carStyle.left,
        bottom: carStyle.bottom,

        width: `${carStyle.width}px`,
        height: "auto",
        aspectRatio: "2 / 1",

        backgroundImage: `url(${carImage})`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",

        opacity: 0,
        transition: "opacity 0.35s ease",
      }}
    />
  );
}

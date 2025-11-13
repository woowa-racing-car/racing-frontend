import React, { useEffect, useRef } from "react";

export default function MyPageCarDisplay({ carImage }) {
  const carRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (carRef.current) {
        carRef.current.style.opacity = 1; // 조명 끝나면 바로 나타남
      }
    }, 1400); // 조명 두 번(0.6s ×2) + 여유 = 1.4초

    return () => clearTimeout(timer);
  }, [carImage]);

  return (
    <img
      ref={carRef}
      src={carImage}
      alt="car"
      style={{
        position: "absolute",
        bottom: "35px",
        left: "12%",
        width: "730px",
        zIndex: 8,

        opacity: 0,      // 시작은 안 보임
        transition: "opacity 0.01s linear", // 거의 즉시 보이게
      }}
    />
  );
}

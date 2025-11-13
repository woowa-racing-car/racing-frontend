import React, { useEffect, useRef } from "react";

export default function MyPageCarDisplay({ carImage }) {
  const carRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (carRef.current) {
        carRef.current.style.opacity = 1;
      }
    }, 1400); 

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

        opacity: 0,      
        transition: "opacity 0.01s linear", 
      }}
    />
  );
}

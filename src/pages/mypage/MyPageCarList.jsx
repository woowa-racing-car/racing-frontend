import React from "react";

import redIcon from "../../assets/images/redcar-icon.svg";
import blueIcon from "../../assets/images/bluecar-icon.svg";
import greenIcon from "../../assets/images/greencar-icon.svg";

export default function MyPageCarList({ cars, selectedCar, onSelect }) {
  const icons = { red: redIcon, blue: blueIcon, green: greenIcon };

  const nameColors = {
    red: "#ff4141",
    blue: "#3b82ff",
    green: "#28c76f",
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "150px",
        left: "30px",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        zIndex: 10,
      }}
    >
      {Object.keys(cars).map((id) => {
        const car = cars[id];
        const isSelected = selectedCar === id;

        return (
          <div key={id} style={{ position: "relative" }}>
           
            <div
              onClick={() => onSelect(id)}
              style={{
                width: "210px",
                height: "70px",
                cursor: "pointer",
                display: "flex",
                transform: isSelected ? "scale(1.05)" : "scale(1)",
                transition: "all 0.15s ease",

                filter: isSelected
                  ? "brightness(1.1)"
                  : car.locked
                  ? "brightness(0.55)"
                  : "brightness(0.75)",
              }}
            >
           
              <div
                style={{
                  width: "60px",
                  height: "70px",
                  background: "#ffffff",
                  border: "3px solid #4ad7e6",
                  borderRight: "none",
                  borderRadius: "6px 0 0 6px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 2,
                }}
              >
                <img
                  src={icons[id]}
                  alt={id}
                  style={{ width: "36px", height: "36px" }}
                />
              </div>

              <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "#4ad7e6",
                    clipPath: "polygon(0 0, 100% 0, 92% 100%, 0% 100%)",
                    borderRadius: "0 6px 6px 0",
                  }}
                />

                <div
                  style={{
                    position: "absolute",
                    inset: "3px",
                    background: "#ffffff",
                    clipPath: "polygon(0 0, 100% 0, 92% 100%, 0% 100%)",
                    borderRadius: "0 4px 4px 0",
                    paddingLeft: "10px",
                    paddingTop: "12px",
                    lineHeight: "1.1",
                  }}
                >
                  <span
                    style={{
                      color: isSelected
                        ? nameColors[id]
                        : nameColors[id] + "bb",
                      fontSize: isSelected ? "17px" : "15px",
                      fontWeight: "800",
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {car.name}
                  </span>

                  <div
                    style={{
                      marginTop: "5px",
                      color: "#777",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    speed {car.speed}
                  </div>
                </div>
              </div>
            </div>

            {car.locked && (
              <i
                className="bi bi-lock-fill"
                style={{
                  position: "absolute",
                  left: "17px",
                  top: "20px",
                  fontSize: "24px",
                  color: "#ffffff",
                  zIndex: 9999999,
                  pointerEvents: "none",
                  filter: "drop-shadow(0px 0px 3px rgba(0,0,0,0.9))",
                }}
              ></i>
            )}
          </div>
        );
      })}
    </div>
  );
}

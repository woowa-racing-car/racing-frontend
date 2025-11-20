import { createContext, useState, useEffect } from "react";
import blueCar from "../../assets/images/bluecar-icon.svg";
import greenCar from "../../assets/images/greencar-icon.svg";
import redCar from "../../assets/images/redcar-icon.svg";
import startFlag from "../../assets/images/race-start-flag.svg";

export const RaceContext = createContext();

export default function RaceManager({ children }) {
  const [isRacing, setIsRacing] = useState(false);
  const TRACK_LENGTH = 7000;

const [raceCars, setRaceCars] = useState([
  { id: 1, name: "지환", x: 0, speed: 300, lane: 0, img: redCar, width: 300, color: "#ff3d3d" },
  { id: 2, name: "지명", x: 0, speed: 380, lane: 1, img: blueCar, width: 300, color: "#3da4ff" },
  { id: 3, name: "아름", x: 0, speed: 290, lane: 2, img: greenCar, width: 300, color: "#4cff4c" },
]);



  useEffect(() => {
    let last = performance.now();

    function loop(now) {
      const delta = (now - last) / 1000;
      last = now;

      if (isRacing) {
        setRaceCars(prev =>
          prev.map(car => ({
            ...car,
            x: car.x + car.speed * delta,
          }))
        );
      }

      requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
  }, [isRacing]);

  return (
    <RaceContext.Provider value={{ raceCars, isRacing, TRACK_LENGTH }}>
      {!isRacing && (
        <img
          src={startFlag}
          onClick={() => setIsRacing(true)}
          style={{
            position: "absolute",
            right: "40px",
            bottom: "40px",
            width: "150px",
            cursor: "pointer",
            zIndex: 999,
          }}
        />
      )}

      {children}
    </RaceContext.Provider>
  );
}

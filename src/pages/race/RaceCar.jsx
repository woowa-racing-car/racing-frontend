export default function RaceCar({ car, cameraX }) {
  const drawX = car.x - cameraX + 1200 / 2; 
    <img
      src={car.raceImage}
      style={{
        position: "absolute",
        transform: `translate(${drawX}px, ${car.y}px)`,
        width: "120px",
      }}
    />
  );
}

import redCar from "../assets/images/car-red.png";
import blueCar from "../assets/images/car-blue.png";
import greenCar from "../assets/images/car-green.png";
import lockIcon from "../assets/images/lock.png";

export const cars = [
  {
    id: "red",
    name: "RED car",
    speed: 10,
    image: redCar,
    locked: false,
  },
  {
    id: "blue",
    name: "BLUE car",
    speed: 12,
    image: blueCar,
    locked: true,
  },
  {
    id: "green",
    name: "GREEN car",
    speed: 14,
    image: greenCar,
    locked: true,
  },
];

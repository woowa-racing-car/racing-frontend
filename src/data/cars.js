import redCar from "../assets/images/car-red.png";
import blueCar from "../assets/images/car-blue.png";
import greenCar from "../assets/images/car-green.png";
import lockIcon from "../assets/images/lock.png";

export const cars = {
  red: {
    id: "red",
    name: "RED car",
    speed: 10,
    image: redCar,
    locked: false,
  },
  blue: {
    id: "blue",
    name: "BLUE car",
    speed: 12,
    image: blueCar,
    locked: true,
  },
  green: {
    id: "green",
    name: "GREEN car",
    speed: 14,
    image: greenCar,
    locked: true,
  },
};

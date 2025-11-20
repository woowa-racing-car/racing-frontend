import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import MainPage from "./pages/MainPage";
import MyPage from "./pages/mypage/MyPage";
import StartPage from "./pages/start/StartPage";
import PriceEntry from "./pages/price-entry/PriceEntry";
import RoomList from "./pages/room-list/RoomList";
import StartTransition from "./pages/start/StartTransition";


import RacePage from "./pages/race/RacePage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/start" element={<StartPage />} />
        <Route path="/price-entry" element={<PriceEntry />} />
        <Route path="/rooms/:price" element={<RoomList />} />
        <Route path="/race/:price" element={<RacePage />} />
        <Route path="/start-transition" element={<StartTransition />} />
      </Routes>
    </Router>
  );
}

import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import MainPage from "./pages/MainPage";
import MyPage from "./pages/mypage/MyPage";
import StartPage from "./pages/start/StartPage";
import PriceEntry from "./pages/price-entry/PriceEntry";
import RoomList from "./pages/room-list/RoomList";
import StartTransition from "./pages/start/StartTransition";


import RacePage from "./pages/race/RacePage";

// Route에 key를 추가하기 위한 래퍼 컴포넌트
function RoutesWithKey() {
  const location = useLocation();
  
  // location.pathname을 key로 사용하여 경로가 바뀔 때마다 컴포넌트 재마운트
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/start" element={<StartPage />} />
      <Route path="/price-entry" element={<PriceEntry />} />
      <Route path="/rooms/:price" element={<RoomList key={location.pathname} />} />
      <Route path="/race/:price" element={<RacePage key={location.pathname} />} />
      <Route path="/start-transition" element={<StartTransition />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <RoutesWithKey />
    </Router>
  );
}

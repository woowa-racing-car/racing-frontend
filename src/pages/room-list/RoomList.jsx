import React, { useState } from "react";
import { useParams } from "react-router-dom";
import CommonHeader from "../../components/CommonHeader";

import RoomListBackground from "./RoomListBackground";
import RoomListWoodBoard from "./RoomListWoodBoard";
import RoomListCreateButton from "./RoomListCreateButton";
import RoomListItem from "./RoomListItem";

const RoomList = () => {
  const { price } = useParams();
  const userName = "유저_아이디"; 
  const [rooms, setRooms] = useState({
    100: [
      { title: "지환의 방", current: 1, max: 3, status: "WAITING" },
      { title: "지명의 방", current: 1, max: 3, status: "PLAYING" },
      { title: "아름의 방", current: 1, max: 3, status: "WAITING" },
    ],
    500: [],
    1000: [],
  });

  const coin = 350;
  const roomList = rooms[price] || [];


  const handleCreateRoom = () => {
    const newRoom = {
      title: `${userName}의 방`,
      current: 1,
      max: 3,
      status: "WAITING",
    };


    setRooms((prev) => ({
      ...prev,
      [price]: [...prev[price], newRoom],
    }));

    console.log("새 방 생성:", newRoom);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "1200px",
          height: "675px",
          background: "black",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            width: "100%",
            zIndex: 30,
          }}
        >
          <CommonHeader userName={userName} coin={coin} />
        </div>

        <RoomListBackground />

        <div
          style={{
            position: "absolute",
            top: "120px",
            left: "100px",
            width: "1000px",
            height: "500px",
            zIndex: 20,
          }}
        >
          <RoomListWoodBoard>
           <h1
  style={{
    marginBottom: "20px",
    color: "#43220c",
    fontFamily: "Giants",
    fontSize: "40px",
    marginLeft: "150px",
  }}
>
  {price}원 방
</h1>


            {roomList.length === 0 ? (
              <div
                style={{
                  marginTop: "150px",
                  textAlign: "center",
                  fontSize: "24px",
                  color: "#43220c",
                }}
              >
                현재 진행 중인 방이 없습니다.
              </div>
            ) : (
              roomList.map((room, i) => (
                <RoomListItem
                  key={i}
                  title={room.title}
                  current={room.current}
                  max={room.max}
                  status={room.status}
                  onClick={() => console.log(room.title + " 입장!")}
                />
              ))
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "25px",
              }}
            >
              <RoomListCreateButton onClick={handleCreateRoom} />
            </div>
          </RoomListWoodBoard>
        </div>
      </div>
    </div>
  );
};

export default RoomList;

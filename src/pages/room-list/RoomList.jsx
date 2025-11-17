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
      { title: "새 방4", current: 1, max: 3, status: "WAITING" },
      { title: "새 방5", current: 2, max: 3, status: "PLAYING" },
    ],
    500: [],
    1000: [],
  });

  const coin = 350;
  const roomList = rooms[price] || [];

  const ITEMS_PER_PAGE = 3;
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(roomList.length / ITEMS_PER_PAGE);
  const startIndex = page * ITEMS_PER_PAGE;
  const visibleRooms = roomList.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const hasPrev = page > 0;
  const hasNext = page < totalPages - 1;

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
            top: "75px",
            left: "100px",
            width: "1000px",
            height: "570px",
            zIndex: 20,
          }}
        >
          <RoomListWoodBoard>
        
            <h1
  style={{
    position: "relative",
    top: "29px",  
    marginBottom: "15px",
    color: "#43220c",
    fontFamily: "Giants",
    fontSize: "40px",
    marginLeft: "200px",
  }}
>
  {price}원 방
</h1>

            <div
              style={{
                position: "relative",
                marginTop: "90px",
                height: "420px", 
              }}
            >
            
              <div
                style={{
                  paddingBottom: "120px", 
                }}
              >
                {visibleRooms.length === 0 ? (
                  <div
                    style={{
                      marginTop: "30px",
                      textAlign: "center",
                      fontSize: "24px",
                      color: "#43220c",
                    }}
                  >
                    현재 진행 중인 방이 없습니다.
                  </div>
                ) : (
                  visibleRooms.map((room, i) => (
                    <RoomListItem
                      key={startIndex + i}
                      title={room.title}
                      current={room.current}
                      max={room.max}
                      status={room.status}
                      onClick={() => console.log(room.title + " 입장!")}
                    />
                  ))
                )}
              </div>

              <div
                style={{
                  position: "absolute",
                  bottom: 30,
                  left: 0,
                  width: "100%",
                }}
              >
              
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "25px",
                    marginBottom: "10px",
                  }}
                >
                  <span
                    onClick={() => hasPrev && setPage(page - 1)}
                    style={{
                      fontSize: "36px",
                      fontWeight: "900",
                      cursor: hasPrev ? "pointer" : "default",
                      opacity: hasPrev ? 1 : 0.3,
                      color: "#43220c",
                      userSelect: "none",
                    }}
                  >
                    {"<"}
                  </span>

                  <span
                    style={{
                      fontSize: "28px",
                      fontWeight: "800",
                      color: "#43220c",
                    }}
                  >
                    {totalPages === 0 ? "0 / 0" : `${page + 1} / ${totalPages}`}
                  </span>

                  <span
                    onClick={() => hasNext && setPage(page + 1)}
                    style={{
                      fontSize: "36px",
                      fontWeight: "900",
                      cursor: hasNext ? "pointer" : "default",
                      opacity: hasNext ? 1 : 0.3,
                      color: "#43220c",
                      userSelect: "none",
                    }}
                  >
                    {">"}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <RoomListCreateButton onClick={handleCreateRoom} />
                </div>
              </div>
            </div>
          </RoomListWoodBoard>
        </div>
      </div>
    </div>
  );
};

export default RoomList;

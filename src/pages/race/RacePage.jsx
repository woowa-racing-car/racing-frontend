import RaceManager from "./RaceManager";
import RaceTrack from "./RaceTrack";
import CommonHeader from "../../components/CommonHeader";

export default function RacePage() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >

      <div
        style={{
          position: "relative",
          width: "1200px",
          height: "675px",
          overflow: "hidden",
          background: "black",
        }}
      >
        <CommonHeader userName="지환" coin={1200} />

        <RaceManager>
          <RaceTrack />
        </RaceManager>
      </div>
    </div>
  );
}

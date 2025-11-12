import React from "react";

export default function MainInput({ label, type }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
      <label
        style={{
          width: "70px",
          fontSize: "17px",
          color: "#5A2E00",
          fontFamily: "Giants-Regular",
        }}
      >
        {label}
      </label>
      <input
        type={type}
        style={{
          flex: 1,
          height: "34px",
          background: "#E5D3B8",
          border: "none",
          borderRadius: "6px",
          padding: "0 8px",
          fontSize: "15px",
          outline: "none",
          fontFamily: "Giants-Regular",
        }}
      />
    </div>
  );
}

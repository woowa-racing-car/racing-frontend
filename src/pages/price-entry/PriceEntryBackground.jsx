import React from "react";
import backgroundImg from "../../assets/images/price-entry-background.svg";

const PriceEntryBackground = () => {
  return (
    <div className="price-entry-background">
      <img src={backgroundImg} alt="price-entry-background" className="entry-bg-img" />
    </div>
  );
};

export default PriceEntryBackground;

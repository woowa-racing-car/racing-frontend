import React from "react";
import btn100 from "../../assets/images/price-entry-100button.svg";
import btn500 from "../../assets/images/price-entry-500button.svg";
import btn1000 from "../../assets/images/price-entry-1000button.svg";

const PriceEntryButtons = () => {
  return (
    <div className="entry-button-area">
      <img src={btn100} alt="100원 입장" className="entry-btn-img" />
      <img src={btn500} alt="500원 입장" className="entry-btn-img" />
      <img src={btn1000} alt="1000원 입장" className="entry-btn-img" />
    </div>
  );
};

export default PriceEntryButtons;

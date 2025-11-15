import React from "react";
import PriceEntryBackground from "./PriceEntryBackground";
import PriceEntryButtons from "./PriceEntryButtons";

const PriceEntry = () => {
  return (
    <div className="price-entry-wrapper">
      <PriceEntryBackground />
      <PriceEntryButtons />
    </div>
  );
};

export default PriceEntry;

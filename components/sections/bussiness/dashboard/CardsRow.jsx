"use client";
import React from "react";
import Card from "./Card";

const CardsRow = () => {
  return (
    <div className="hidden gap-x-10 xl:flex flex-col gap-5">
      <Card title="259,786" content={"Total Bags Made"} />
      <Card title="15" content={"Today's Bag"} />
    </div>
  );
};

export default CardsRow;

"use client";
import React from "react";
import Card from "./Card";

const CardsRow = () => {
  return (
    <div className="hidden lg:flex flex-col lg:flex-row lg:w-[100%]">
      <div className="flex flex-col gap-5 lg:w-[100%]">
        <Card title="259,786" content={"Total Businesses"} />
        <Card title="15" content={"Today's Bag Made"} />
      </div>
      <div className="flex flex-col gap-5 lg:w-[100%]">
        <Card title="259,786" content={"Total Customers"} />
        <Card title="15" content={"Today's Total Bags"} />
      </div>
    </div>
  );
};

export default CardsRow;

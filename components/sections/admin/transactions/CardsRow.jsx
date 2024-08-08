"use client";
import React from "react";
import TransactionCard from "./TransactionCard";

const CardsRow = () => {
  return (
    <div className="hidden gap-x-10 xl:flex gap-5 lg:w-[100%] flex-row">
      <TransactionCard title="€2,786.22" content={"Revenue Generated"} textColor={"text-secondary"}/>
      <TransactionCard title="59,786" content={"Total Businesses"} textColor={"text-blackTwo"}/>
    </div>
  );
};

export default CardsRow;

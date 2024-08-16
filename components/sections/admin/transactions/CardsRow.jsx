"use client";
import React, { useEffect, useState } from "react";
import TransactionCard from "./TransactionCard";
import StatSlider from "./StatSlider";

const CardsRow = () => {
  const [isSmallDevice, setIsSmallDevice] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallDevice(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isSmallDevice ? (
    <StatSlider />
  ) : (
    <div className="hidden gap-x-10 lg:flex gap-5 lg:w-[100%] flex-row">
      <TransactionCard
        title="€2,786.22"
        content={"Revenue Generated"}
        textColor={"text-secondary"}
      />
      <TransactionCard
        title="59,786"
        content={"Total Businesses"}
        textColor={"text-blackTwo"}
      />
    </div>
  );
};

export default CardsRow;

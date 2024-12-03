"use client";
import React, { useEffect, useState } from "react";
import Card from "./Card";

const CardsRow = ({ totalBags, bagToday, vendorCount, customerCount }) => {
  const [currLang, setCurrLang] = useState("en");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedLang = localStorage.getItem("lang");
      setCurrLang(storedLang);
      if (storedLang) {
        setCurrLang(storedLang);
      }
    }
  }, []);
  
  return (
    <div className="hidden lg:flex flex-col lg:flex-row lg:w-[100%]">
      <div className="flex flex-col gap-5 lg:w-[100%]">
        <Card title={vendorCount} content={"Total Businesses"} />
        <Card
          title={
            totalBags.length === 0
              ? 0
              : totalBags.length.toLocaleString("en-US")
          }
          content={`Total ${currLang === "en" ? "Bag" : "Pouches"} Made`}
        />
      </div>
      <div className="flex flex-col gap-5 lg:w-[100%]">
        <Card title={customerCount} content={"Total Customers"} />
        <Card
          title={Number(bagToday).toLocaleString("en-US")}
          content={`Today's Total ${currLang === "en" ? "Bags" : "Pouches"}`}
        />
      </div>
    </div>
  );
};

export default CardsRow;

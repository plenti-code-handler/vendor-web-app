"use client";
import React, { useEffect, useState } from "react";
import Card from "./Card";

const CardsRow = ({ totalBags, bagToday, vendorCount, customerCount }) => {
  const [currLang, setCurrLang] = useState("en");

    useEffect(() => {
      if (typeof window !== "undefined") {
        const updateLangFromStorage = () => {
          const storedLang = localStorage.getItem("lang");
          if (storedLang) {
            setCurrLang(storedLang);
          }
        };

        const timeoutId = setTimeout(() => {
          updateLangFromStorage();
          window.addEventListener("storage", updateLangFromStorage);
        }, 2000);
        return () => {
          clearTimeout(timeoutId);
          window.removeEventListener("storage", updateLangFromStorage);
        };
      }
    }, []);

    useEffect(() => {
      if (typeof window !== "undefined" && document.body) {
        document.body.setAttribute("lang", currLang);
      }
    }, [currLang]);

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

"use client";
import React, { useEffect, useState } from "react";
import Card from "./Card";

const CardsRow = () => {
  const [totalBags, setTotalBags] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const storedBags = localStorage.getItem("Totalbags");
      const storedOrders = localStorage.getItem("Totalorders");

      if (storedBags) setTotalBags(parseInt(storedBags, 10));
      if (storedOrders) setTotalOrders(parseInt(storedOrders, 10));
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="hidden md:block gap-x-10 lg:flex flex-col gap-5">
      <Card
        title={totalBags.toLocaleString("en-US")}
        content="Total Bags Made"
      />
      <Card
        title={totalOrders.toLocaleString("en-US")}
        content="Total Orders"
      />
    </div>
  );
};

export default CardsRow;

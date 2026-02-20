"use client";

import CardsRow from "./CardsRow";
import StatSlider from "./StatSlider";
import React, { useEffect, useState } from "react";
import RevenueChart from "../../bussiness/dashboard/RevenueChart";
import { useDispatch } from "react-redux";
import { setActivePage } from "../../../../redux/slices/headerSlice";

const RenderStats = () => {
  const [isSmallDevice, setIsSmallDevice] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setActivePage("Dashboard"));
  }, [dispatch]);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallDevice(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="w-full px-2">
        <CardsRow />
      </div>
      <div className="w-full px-2">
        <RevenueChart />
      </div>
    </div>
  );
};

export default RenderStats;
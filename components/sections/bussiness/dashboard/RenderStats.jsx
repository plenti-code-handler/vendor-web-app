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

  return isSmallDevice ? (
    <>
      <div className="flex-1 lg:flex-[0_0_30%] px-2 mb-2">
        {isSmallDevice ? <StatSlider /> : <CardsRow />}
      </div>
      <div className="flex-1 lg:flex-[0_0_70%] px-2">
        <RevenueChart />
      </div>
    </>
  ) : (
    <div className="flex w-[100%] gap-[2.8%]">
      <div className="flex-1 lg:flex-[0_0_70%] lg:flex-row">
        <RevenueChart />
      </div>
      <div className="flex-1 lg:flex-[0_0_30%] lg:flex-row">
        {isSmallDevice ? <StatSlider /> : <CardsRow />}
      </div>
    </div>
  );
};

export default RenderStats;

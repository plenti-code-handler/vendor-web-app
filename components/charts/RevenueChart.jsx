"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const RevenueChart = () => {
  const [chartData] = useState({
    series: [
      {
        name: "Monthly Revenue",
        data: [
          3000, 3500, 3200, 4000, 4500, 5000, 4800, 5100, 4900, 5200, 5400,
          5600,
        ],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "area",
        width: 515,
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      colors: ["#74D5B3", "#74D5B3"],
      stroke: {
        curve: "smooth",
      },
      xaxis: {
        type: "datetime",
        categories: [
          "2024-01-01T00:00:00.000Z",
          "2024-02-01T00:00:00.000Z",
          "2024-03-01T00:00:00.000Z",
          "2024-04-01T00:00:00.000Z",
          "2024-05-01T00:00:00.000Z",
          "2024-06-01T00:00:00.000Z",
          "2024-07-01T00:00:00.000Z",
          "2024-08-01T00:00:00.000Z",
          "2024-09-01T00:00:00.000Z",
          "2024-10-01T00:00:00.000Z",
          "2024-11-01T00:00:00.000Z",
          "2024-12-01T00:00:00.000Z",
        ],
      },
      tooltip: {
        x: {
          format: "dd/MM/yy",
        },
      },
    },
  });

  return (
    <div className="flex h-full flex-col justify-between py-2.5  border border-grayTwo rounded-md">
      <div className="flex flex-col mt-4 ml-8">
        <h1 className="text-[18px] font-semibold leading-[28px] text-headingText">
          Revenue
        </h1>
        <h1 className="text-[40px] leading-[28px] text-mainLight font-bold my-4">
          <sup>€</sup>
          12,706
        </h1>
      </div>
      <div id="chart" className="w-full">
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="area"
          height={220}
        />
      </div>
    </div>
  );
};

export default RevenueChart;

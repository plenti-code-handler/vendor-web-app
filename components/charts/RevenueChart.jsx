"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const RevenueChart = () => {
  const [colorsLables] = useState(Array(12).fill("#7E8299"));
  const [chartData] = useState({
    series: [
      {
        name: "Monthly Revenue",
        data: [
          100, 3500, 100, 4000, 2000, 5000, 1800, 6100, 4900, 200, 5400, 5600,
        ].slice(3, 7), // Assuming the current month is April and the data starts from the 4th element (0-indexed)
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
      colors: ["#74D5B3"],
      stroke: {
        curve: "smooth",
      },
      xaxis: {
        type: "datetime",
        categories: [
          "2024-04-06T00:00:00.000Z",
          "2024-04-10T00:00:00.000Z",
          "2024-04-14T00:00:00.000Z",
          "2024-04-18T00:00:00.000Z",
        ],
        labels: {
          format: "MMM dd",
          style: {
            fontSize: "12px",
            fontWeight: 600,
            colors: colorsLables,
          },
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        offsetX: 25, // The origin point of '0' to move labels slightly to the right
      },
      yaxis: {
        min: 0,
        max: 6000,
        tickAmount: 4,
        labels: {
          formatter: (val) => (val === 0 ? "0" : `$${val}`),
          style: {
            fontSize: "12px",
            fontWeight: 600,
            colors: ["#7E8299"],
          },
        },
      },

      grid: {
        borderColor: "#e0e0e0",
        strokeDashArray: 4,
      },
      tooltip: {
        x: {
          format: "dd/MM/yy",
        },
      },
    },
  });

  return (
    <div className="flex h-full flex-col justify-between py-2.5 border border-grayTwo rounded-2xl lg:w-[100%]">
      <div className="flex flex-col mt-4 ml-8">
        <h1 className="text-[18px] font-semibold leading-[28px] text-blackTwo">
          Revenue
        </h1>
        <h1 className="text-[40px] leading-[28px] text-mainLight font-bold my-4">
          <sup className="text-[24px] text-mainLight font-semibold">€</sup>
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

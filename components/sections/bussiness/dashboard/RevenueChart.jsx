import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Tabs from "../../../../components/Tabs/Tabs";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const RevenueChart = () => {
  const [colorsLables] = useState(Array(12).fill("#7E8299"));
  const [countryCode, setCountryCode] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCountryCode = JSON.parse(localStorage.getItem("countryCode"));
      setCountryCode(storedCountryCode || "SEK");
    }
  }, []);

  // Dummy data for chart
  const dummyRevenueData = [100, 200, 150, 300, 250, 400, 350];
  const dummyDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString();
  }).reverse();

  const [chartData, setChartData] = useState({
    series: [
      {
        name: "Daily Revenue",
        data: dummyRevenueData,
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
        categories: dummyDates,
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
        offsetX: 25,
      },
      yaxis: {
        tickAmount: 4,
        labels: {
          formatter: (val) => `${countryCode} ${val}`,
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

  const handleTabChange = (tab) => {
    console.log("Tab changed to:", tab);
  };

  const tabs = [
    { name: "Daily", component: null },
    { name: "Weekly", component: null },
    { name: "Monthly", component: null },
    { name: "All", component: null },
  ];

  return (
    <div className="flex h-full flex-col justify-between py-2.5 border border-gray-300 rounded-2xl lg:w-full">
      <div className="flex flex-col mt-4 ml-8">
        <h1 className="text-lg font-semibold leading-[28px] text-black">
          Total Revenue
        </h1>
        <div className="w-full flex justify-end px-5">
          <Tabs tabs={tabs} onChange={handleTabChange} />
        </div>
        <h1 className="text-[40px] leading-[28px] text-mainLight font-bold my-4">
          <sup className="text-2xl text-mainLight font-semibold">
            {countryCode}
          </sup>
          100
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

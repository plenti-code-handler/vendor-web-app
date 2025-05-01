import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import Tabs from "../../../../components/Tabs/Tabs";
import axiosClient from "../../../../AxiosClient";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const RevenueChart = () => {
  const [colorsLabels] = useState(Array(12).fill("#7E8299"));
  const [activeTab, setActiveTab] = useState("Daily");
  const [totalRevenue, setTotalRevenue] = useState(null);
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        height: 350,
        type: "area",
        width: 515,
        zoom: { enabled: false },
        toolbar: { show: false },
      },
      dataLabels: { enabled: false },
      colors: ["#5F22D9"],
      stroke: { curve: "smooth" },
      xaxis: {
        type: "datetime",
        categories: [],
        labels: {
          format: "MMM dd",
          style: {
            fontSize: "12px",
            fontWeight: 600,
            colors: colorsLabels,
          },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
        offsetX: 25,
      },
      yaxis: {
        tickAmount: 4,
        labels: {
          formatter: (val) => val,
          style: {
            fontSize: "12px",
            fontWeight: 600,
            colors: ["#7E8299"],
          },
        },
      },
      grid: { borderColor: "#e0e0e0", strokeDashArray: 4 },
      tooltip: { x: { format: "dd/MM/yy" } },
    },
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosClient.get("/v1/vendor/stats/");
        if (response.status === 200) {
          toast.success("Stats fetched successfully!");
          const {
            daily_revenue,
            monthly_revenue,
            yearly_revenue,
            total_revenue,
            total_packs_created,
            total_orders,
          } = response.data;

          console.log(response.data);
          setTotalRevenue(total_revenue);

          localStorage.setItem("Totalbags", total_packs_created);
          localStorage.setItem("Totalorders", total_orders);
          localStorage.setItem("Totalrevenue", total_revenue ?? 0);

          const transformedData = {
            Daily: {
              name: "Daily Revenue",
              data: daily_revenue.map((item) => item.revenue),
              categories: daily_revenue.map((item) => item.date),
            },
            Monthly: {
              name: "Monthly Revenue",
              data: monthly_revenue.map((item) => item.revenue),
              categories: monthly_revenue.map((item) => item.date),
            },
            Yearly: {
              name: "Yearly Revenue",
              data: yearly_revenue.map((item) => item.revenue),
              categories: yearly_revenue.map((item) => item.date),
            },
          };

          setChartData((prevData) => ({
            ...prevData,
            series: [
              {
                name: transformedData[activeTab].name,
                data: transformedData[activeTab].data,
              },
            ],
            options: {
              ...prevData.options,
              xaxis: {
                ...prevData.options.xaxis,
                type: activeTab === "Yearly" ? "category" : "datetime",
                categories: transformedData[activeTab].categories,
                labels: {
                  format: activeTab === "Yearly" ? undefined : "MMM dd",
                  style: {
                    fontSize: "12px",
                    fontWeight: 600,
                    colors: colorsLabels,
                  },
                },
              },
            },
          }));
        }
      } catch (error) {
        toast.error("Failed to fetch stats");
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, [activeTab]);

  return (
    <div className="flex h-full flex-col justify-between py-2.5 border border-gray-300 rounded-2xl lg:w-full">
      <div className="flex flex-col mt-4 ml-8">
        <h1 className="text-lg font-semibold leading-[28px] text-black">
          Total Revenue
        </h1>
        <div className="w-full flex justify-end px-5">
          <Tabs
            tabs={[{ name: "Daily" }, { name: "Monthly" }, { name: "Yearly" }]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>
        <h1 className="text-[40px] leading-[28px] text-primary font-bold my-4">
          {totalRevenue ? totalRevenue : "0"}
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

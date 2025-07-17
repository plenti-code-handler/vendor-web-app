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
  const [chartType, setChartType] = useState("revenue"); // New state for chart type
  const [totalRevenue, setTotalRevenue] = useState(null);
  const [totalOrders, setTotalOrders] = useState(null); // New state for total orders
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
          console.log(response.data);
          const {
            daily_revenue,
            monthly_revenue,
            yearly_revenue,
            total_revenue,
            total_packs_created,
            total_orders,
            daily_orders,
            monthly_orders,
            yearly_orders,
          } = response.data;

          console.log(response.data);
          setTotalRevenue(total_revenue);
          setTotalOrders(total_orders); // Set total orders

          localStorage.setItem("Totalbags", total_packs_created);
          localStorage.setItem("Totalorders", total_orders);
          localStorage.setItem("Totalrevenue", total_revenue ?? 0);

          const transformedData = {
            Daily: {
              revenue: {
                name: "Daily Revenue",
                data: daily_revenue.map((item) => item.value),
                categories: daily_revenue.map((item) => item.date),
              },
              orders: {
                name: "Daily Orders",
                data: daily_orders.map((item) => item.value), // Assuming orders data exists
                categories: daily_orders.map((item) => item.date),
              },
            },
            Monthly: {
              revenue: {
                name: "Monthly Revenue",
                data: monthly_revenue.map((item) => item.value),
                categories: monthly_revenue.map((item) => item.date),
              },
              orders: {
                name: "Monthly Orders",
                data: monthly_orders.map((item) => item.value || 0),
                categories: monthly_orders.map((item) => item.date),
              },
            },
            Yearly: {
              revenue: {
                name: "Yearly Revenue",
                data: yearly_revenue.map((item) => item.value),
                categories: yearly_revenue.map((item) => item.date),
              },
              orders: {
                name: "Yearly Orders",
                data: yearly_orders.map((item) => item.value || 0),
                categories: yearly_orders.map((item) => item.date),
              },
            },
          };

          const currentData = transformedData[activeTab][chartType];

          setChartData((prevData) => ({
            ...prevData,
            series: [
              {
                name: currentData.name,
                data: currentData.data,
              },
            ],
            options: {
              ...prevData.options,
              xaxis: {
                ...prevData.options.xaxis,
                type: activeTab === "Yearly" ? "category" : "datetime",
                categories: currentData.categories,
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
  }, [activeTab, chartType]); // Added chartType dependency

  // ... existing useEffect for fetchVendorDetails ...

  const getDisplayValue = () => {
    if (chartType === "revenue") {
      return totalRevenue ? totalRevenue : "0";
    } else {
      return totalOrders ? totalOrders : "0";
    }
  };

  const getDisplayLabel = () => {
    return chartType === "revenue" ? "Total Revenue" : "Total Orders";
  };

  const getDisplayUnit = () => {
    return chartType === "revenue" ? "INR ₹" : "";
  };

  return (
    <div className="flex h-full flex-col justify-between py-2.5 border border-gray-300 rounded-2xl lg:w-full">
      <div className="flex flex-col mt-4 ml-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold leading-[28px] text-black">
            {getDisplayLabel()}
          </h1>
          
          {/* Chart Type Dropdown */}
          <div className="relative mr-8">
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer hover:border-gray-400 transition-colors"
            >
              <option value="revenue">Revenue Chart</option>
              <option value="orders">Orders Chart</option>
            </select>
            
            {/* Custom dropdown arrow */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-end px-5">
          <Tabs
            tabs={[{ name: "Daily" }, { name: "Monthly" }, { name: "Yearly" }]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>
        
        <h1 className="text-[40px] leading-[28px] text-primary font-bold my-4">
          {getDisplayValue()}
          {getDisplayUnit() && (
            <span className="text-base ml-1">{getDisplayUnit()}</span>
          )}
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
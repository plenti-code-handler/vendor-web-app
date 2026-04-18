import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import Tabs from "../../../../components/Tabs/Tabs";
import axiosClient from "../../../../AxiosClient";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[260px] items-center justify-center text-gray-500">
      Loading chart…
    </div>
  ),
});

const X_AXIS_LABEL_COLORS = Array(12).fill("#7E8299");

const ANNOTATION_LABEL_STYLE = {
  fontSize: "11px",
  fontWeight: 600,
  padding: { left: 6, right: 6, top: 2, bottom: 2 },
};

function buildBarAnnotations(categories, data, revenue) {
  if (!Array.isArray(data) || !Array.isArray(categories) || !data.length) {
    return {};
  }
  const n = Math.min(categories.length, data.length);
  const nums = data.slice(0, n).map((v) => Number(v) || 0);
  const cats = categories.slice(0, n);
  const max = Math.max(...nums);
  const avg = nums.reduce((a, b) => a + b, 0) / n;
  if (max === 0 && avg === 0) return {};

  const fmt = (v) =>
    revenue
      ? `₹${Number(v).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`
      : `${Math.round(v)}`;

  const maxIdx = nums.indexOf(max);
  const xPeak = cats[maxIdx];

  const annotations = {
    yaxis: [
      {
        y: avg,
        borderColor: "#94a3b8",
        strokeDashArray: 5,
        borderWidth: 1,
        label: {
          text: `Avg ${fmt(avg)}`,
          borderColor: "#94a3b8",
          style: { ...ANNOTATION_LABEL_STYLE, color: "#fff", background: "#94a3b8" },
        },
      },
    ],
  };

  if (max > 0 && xPeak != null) {
    annotations.points = [
      {
        x: xPeak,
        y: max,
        seriesIndex: 0,
        marker: { size: 0 },
        label: {
          borderColor: "#5F22D9",
          offsetY: -6,
          text: `Peak ${fmt(max)}`,
          style: { ...ANNOTATION_LABEL_STYLE, color: "#fff", background: "#5F22D9" },
        },
      },
    ];
  }

  return annotations;
}

function segment(revenueRows, orderRows, revenueTitle, orderTitle) {
  return {
    revenue: {
      name: revenueTitle,
      data: revenueRows.map((r) => r.value),
      categories: revenueRows.map((r) => r.date),
    },
    orders: {
      name: orderTitle,
      data: orderRows.map((r) => r.value ?? 0),
      categories: orderRows.map((r) => r.date),
    },
  };
}

function baseChartOptions() {
  return {
    chart: {
      type: "bar",
      height: 350,
      zoom: { enabled: false },
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        borderRadiusApplication: "end",
        columnWidth: "58%",
      },
    },
    dataLabels: { enabled: false },
    colors: ["#5F22D9"],
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "vertical",
        shadeIntensity: 0.5,
        opacityFrom: 0.95,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
    xaxis: {
      type: "datetime",
      categories: [],
      labels: {
        format: "MMM dd",
        style: { fontSize: "12px", fontWeight: 600, colors: X_AXIS_LABEL_COLORS },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
      offsetX: 8,
    },
    yaxis: {
      tickAmount: 4,
      labels: {
        formatter: (val) => val,
        style: { fontSize: "12px", fontWeight: 600, colors: ["#7E8299"] },
      },
    },
    grid: { borderColor: "#e0e0e0", strokeDashArray: 4 },
    tooltip: { x: { format: "dd/MM/yy" } },
    annotations: {},
  };
}

const RevenueChart = () => {
  const [activeTab, setActiveTab] = useState("Daily");
  const [chartType, setChartType] = useState("revenue");
  const [totalRevenue, setTotalRevenue] = useState(null);
  const [totalOrders, setTotalOrders] = useState(null);
  const [chartData, setChartData] = useState({
    series: [],
    options: baseChartOptions(),
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosClient.get("/v1/vendor/stats/");
        if (response.status !== 200) return;

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

        setTotalRevenue(total_revenue);
        setTotalOrders(total_orders);
        localStorage.setItem("Totalbags", total_packs_created);
        localStorage.setItem("Totalorders", total_orders);
        localStorage.setItem("Totalrevenue", total_revenue ?? 0);

        const transformedData = {
          Daily: segment(
            daily_revenue,
            daily_orders,
            "Daily Revenue",
            "Daily Orders"
          ),
          Monthly: segment(
            monthly_revenue,
            monthly_orders,
            "Monthly Revenue",
            "Monthly Orders"
          ),
          Yearly: segment(
            yearly_revenue,
            yearly_orders,
            "Yearly Revenue",
            "Yearly Orders"
          ),
        };

        const current = transformedData[activeTab][chartType];
        const revenue = chartType === "revenue";

        setChartData((prev) => ({
          series: [{ name: current.name, data: current.data }],
          options: {
            ...prev.options,
            annotations: buildBarAnnotations(
              current.categories,
              current.data,
              revenue
            ),
            xaxis: {
              ...prev.options.xaxis,
              type: activeTab === "Yearly" ? "category" : "datetime",
              categories: current.categories,
              labels: {
                ...prev.options.xaxis.labels,
                format: activeTab === "Yearly" ? undefined : "MMM dd",
              },
            },
          },
        }));
      } catch (error) {
        toast.error("Failed to fetch stats");
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, [activeTab, chartType]);

  const displayLabel = chartType === "revenue" ? "Total Revenue" : "Total Orders";
  const displayValue =
    chartType === "revenue"
      ? totalRevenue != null
        ? totalRevenue.toFixed(2)
        : "0"
      : totalOrders ?? "0";
  const displayUnit = chartType === "revenue" ? "INR ₹" : "";

  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-gray-300 py-2.5 lg:w-full">
      <div className="ml-8 mt-4 flex flex-col">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold leading-[28px] text-black">
            {displayLabel}
          </h1>

          <div className="relative mr-8">
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="cursor-pointer appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 pr-8 text-sm font-medium text-gray-700 transition-colors hover:border-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="revenue">Revenue Chart</option>
              <option value="orders">Orders Chart</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <svg
                className="h-4 w-4 text-gray-400"
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

        <div className="flex w-full justify-end px-5">
          <Tabs
            tabs={[{ name: "Daily" }, { name: "Monthly" }, { name: "Yearly" }]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>

        <h1 className="my-4 text-[40px] font-semibold leading-[28px] text-primary">
          {displayValue}
          {displayUnit ? <span className="ml-1 text-base">{displayUnit}</span> : null}
        </h1>
      </div>

      <div className="w-full" id="chart">
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          height={260}
        />
      </div>
    </div>
  );
};

export default RevenueChart;

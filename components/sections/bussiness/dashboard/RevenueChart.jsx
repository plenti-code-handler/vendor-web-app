import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { auth, db } from "../../../../app/firebase/config";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const RevenueChart = () => {
  const [colorsLables] = useState(Array(12).fill("#7E8299"));
  const [totalRevenue, setTotalRevenue] = useState(0); // State for total revenue
  const [countryCode, setCountryCode] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCountryCode = JSON.parse(localStorage.getItem("countryCode"));
      setCountryCode(storedCountryCode);
    }
  }, []);

  const [chartData, setChartData] = useState({
    series: [
      {
        name: "Daily Revenue",
        data: Array(7).fill(0), // Initialize data with zeros for 7 days
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
        categories: [],
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
        tickAmount: 4,
        labels: {
          formatter: (val) =>
            val === 0
              ? `${countryCode ? countryCode : "SEK"} 0`
              : `${countryCode ? countryCode : "SEK"} ${val}`, // Fixed the dollar sign
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

  useEffect(() => {
    // Fetch revenue data only after countryCode is set
    if (countryCode) {
      fetchRevenueData();
    }
  }, [countryCode]);

  const fetchRevenueData = async () => {
    let total = 0.0; // To hold total revenue
    const today = new Date();
    const lastSevenDays = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(today.getDate() - i);
      return date.toISOString().split("T")[0]; // Get date in 'YYYY-MM-DD' format
    });

    const revenueData = Array(7).fill(0); // To hold revenue for each of the last 7 days

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        console.error("User not authenticated");
        return;
      }

      try {
        const bookingQuery = query(
          collection(db, "bookings"),
          where("vendorid", "==", user.uid), // Match vendorid with the authenticated user's uid
          where(
            "bookingdate",
            ">=",
            Timestamp.fromDate(new Date(lastSevenDays[6])) // Convert date to Firebase Timestamp
          )
        );

        const revenueQuery = query(
          collection(db, "bookings"),
          where("vendorid", "==", user.uid)
        );

        const querySnapshot = await getDocs(bookingQuery);
        const querySnapshotRevenue = await getDocs(revenueQuery);

        querySnapshotRevenue.forEach((doc) => {
          total += doc.data().price;
        });

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const bookingDate = data.bookingdate
            .toDate()
            .toISOString()
            .split("T")[0];
          const index = lastSevenDays.indexOf(bookingDate);
          if (index !== -1) {
            const percentage90 = data.price * 0.9;
            revenueData[index] += percentage90; // Calculate revenue
          }
        });

        setTotalRevenue(total * 0.9);

        // Update chart data with the new revenue data and dates
        setChartData((prevData) => ({
          ...prevData,
          series: [{ ...prevData.series[0], data: revenueData }],
          options: {
            ...prevData.options,
            xaxis: {
              ...prevData.options.xaxis,
              categories: lastSevenDays.map((date) =>
                new Date(date).toISOString()
              ),
            },
            yaxis: {
              ...prevData.options.yaxis,
              labels: {
                formatter: (val) =>
                  val === 0 ? `${countryCode} 0` : `${countryCode} ${val}`, // Update currency dynamically
              },
            },
          },
        }));
      } catch (error) {
        console.error("Error fetching bookings:", error); // Log errors, if any
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  };

  return (
    <div className="flex h-full flex-col justify-between py-2.5 border border-gray-300 rounded-2xl lg:w-full">
      <div className="flex flex-col mt-4 ml-8">
        <h1 className="text-[18px] font-semibold leading-[28px] text-black">
          Total Revenue
        </h1>
        <h1 className="text-[40px] leading-[28px] text-mainLight font-bold my-4">
          <sup className="text-[24px] text-mainLight font-semibold">
            {countryCode ? countryCode : "SEK"}
          </sup>
          {totalRevenue.toLocaleString()}
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

"use client";

import React, { useState, useEffect } from "react";
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
          formatter: (val) => (val === 0 ? "SEK 0" : `SEK ${val}`), // Fixed the dollar sign
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
    var total = 0.0; // To hold total revenue
    const fetchRevenueData = async () => {
      const today = new Date();
      const lastSevenDays = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(today.getDate() - i);
        return date.toISOString().split("T")[0]; // Get date in 'YYYY-MM-DD' format
      });

      const revenueData = Array(7).fill(0); // To hold revenue for each of the last 7 days
      console.log("Initialized revenue data:", revenueData); // Log initialized revenue data

      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (!user) {
          console.error("User not authenticated");
          return;
        }

        console.log("Authenticated user:", user.uid);

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
          console.log("Booking query created for user:", user.uid); // Log the Firestore query

          const querySnapshot = await getDocs(bookingQuery);

          const querySnapshotrevenue = await getDocs(revenueQuery);

          querySnapshotrevenue.forEach((doc) => {
            total += doc.data().price;
          });
          console.log(
            "Query snapshot received, number of bookings:",
            querySnapshot.size
          ); // Log the number of bookings received

          querySnapshot.forEach((doc) => {
            const data = doc.data();
            console.log("Booking data:", data); // Log each booking's data

            const bookingDate = data.bookingdate
              .toDate()
              .toISOString()
              .split("T")[0]; // Convert Firebase Timestamp to 'YYYY-MM-DD'
            console.log("Converted booking date:", bookingDate); // Log the converted booking date

            const index = lastSevenDays.indexOf(bookingDate);
            if (index !== -1) {
              const percentage90 = data.price * 0.9;
              revenueData[index] += percentage90; // Calculate revenue
              console.log(
                `Updated revenue for ${bookingDate}:`,
                revenueData[index]
              ); // Log updated revenue for the specific day
            }
          });

          console.log("Total Revenue: ", total * 0.9);

          setTotalRevenue(total * 0.9);

          // Update chart data with the new revenue data and dates
          console.log("Final revenue data for the last 7 days:", revenueData); // Log the final revenue data
          setChartData((prevData) => ({
            ...prevData,
            series: [{ ...prevData.series[0], data: revenueData }],
            options: {
              ...prevData.options,
              xaxis: {
                ...prevData.options.xaxis,
                categories: lastSevenDays.map((date) =>
                  new Date(date).toISOString()
                ), // Convert dates to ISO format
              },
            },
          }));
          console.log("Chart data updated successfully."); // Log success message after updating chart
        } catch (error) {
          console.error("Error fetching bookings:", error); // Log errors, if any
        }
      });

      // Cleanup subscription on unmount
      return () => unsubscribe();
    };

    fetchRevenueData();
  }, []);

  return (
    <div className="flex h-full flex-col justify-between py-2.5 border border-gray-300 rounded-2xl lg:w-full">
      <div className="flex flex-col mt-4 ml-8">
        <h1 className="text-[18px] font-semibold leading-[28px] text-black">
          Total Revenue
        </h1>
        <h1 className="text-[40px] leading-[28px] text-mainLight font-bold my-4">
          <sup className="text-[24px] text-mainLight font-semibold">SEK</sup>
          {totalRevenue.toLocaleString()} {/* Use the totalRevenue state */}
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

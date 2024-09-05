"use client";

import CardsRow from "./CardsRow";
import StatSlider from "./StatSlider";
import React, { useEffect, useState } from "react";
import RevenueChart from "../../../charts/RevenueChart";
import { useDispatch } from "react-redux";
import { setActivePage } from "../../../../redux/slices/headerSlice";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../app/firebase/config";

const RenderStats = () => {
  const [isSmallDevice, setIsSmallDevice] = useState(false);
  const [bagToday, setBagToday] = useState("");
  const [totalBags, setTotalBags] = useState("");
  const [vendorCount, setVendorCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    // Ensure the user and user.uid are available
    const fetchInitialBags = async () => {
      try {
        const colRef = collection(db, "bags");
        const q = query(
          colRef,
          where("resuid", "==", user.uid) // Adjusted field to resuid
        );

        const allBagsSnapshot = await getDocs(q);
        const bagsData = allBagsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setTotalBags(bagsData);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchInitialBags();
  }, []);

  useEffect(() => {
    const fetchUserCounts = async () => {
      try {
        // Query the "users" collection for documents where "role" is "vendor"
        const vendorQuery = query(
          collection(db, "users"),
          where("role", "==", "vendor")
        );
        const vendorSnapshot = await getDocs(vendorQuery);

        // Query the "users" collection for documents where "role" is "customer"
        const customerQuery = query(
          collection(db, "users"),
          where("role", "==", "customer")
        );
        const customerSnapshot = await getDocs(customerQuery);

        // Set the count of vendors and customers in state
        setVendorCount(vendorSnapshot.size);
        setCustomerCount(customerSnapshot.size);
      } catch (error) {
        console.error("Error fetching user counts:", error);
        toast.error("An error occurred while fetching user counts.");
      }
    };

    fetchUserCounts();
  }, []);

  useEffect(() => {
    if (totalBags.length > 0) {
      const today = new Date();
      const todayStart = new Date(today.setHours(0, 0, 0, 0)); // Start of the day
      const todayEnd = new Date(today.setHours(23, 59, 59, 999)); // End of the day

      let count = 0;

      totalBags.forEach((bag) => {
        if (bag.date && Array.isArray(bag.date)) {
          bag.date.forEach((dateObj) => {
            const bagDate = dateObj.date.toDate(); // Convert Firebase Timestamp to JS Date
            if (bagDate >= todayStart && bagDate <= todayEnd) {
              count++;
            }
          });
        }
      });

      setBagToday(count); // Update the count of bags for today
    }
  }, [totalBags]);

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
      <div className="flex-1 lg:flex-[0_0_30%] px-2">
        {isSmallDevice ? (
          <StatSlider
            vendorCount={vendorCount}
            customerCount={customerCount}
            bagToday={bagToday}
            totalBags={totalBags}
          />
        ) : (
          <CardsRow
            bagToday={bagToday}
            totalBags={totalBags}
            vendorCount={vendorCount}
            customerCount={customerCount}
          />
        )}
      </div>
      <div className="flex-1 lg:flex-[0_0_70%] px-2">
        <RevenueChart />
      </div>
    </>
  ) : (
    <>
      <div className="flex-1 lg:flex-[0_0_50%] lg:flex-row lg:w-[50%] mr-4">
        <RevenueChart />
      </div>
      <div className="flex-1 lg:flex-[0_0_50%] lg:flex-row lg:w-[50%]">
        {isSmallDevice ? (
          <StatSlider
            bagToday={bagToday}
            totalBags={totalBags}
            vendorCount={vendorCount}
            customerCount={customerCount}
          />
        ) : (
          <CardsRow
            bagToday={bagToday}
            totalBags={totalBags}
            vendorCount={vendorCount}
            customerCount={customerCount}
          />
        )}
      </div>
    </>
  );
};

export default RenderStats;

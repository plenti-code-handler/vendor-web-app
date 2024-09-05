"use client";
import React, { useEffect, useState } from "react";
import TransactionCard from "./TransactionCard";
import StatSlider from "./StatSlider";
import { db } from "../../../../app/firebase/config";
import { collection, getDocs, query, where } from "firebase/firestore";
import Loader from "../../../loader/loader";

const CardsRow = () => {
  const [isSmallDevice, setIsSmallDevice] = useState(false);
  const [vendorCount, setVendorCount] = useState(0);
  const [loader, setLoader] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [tenPercent, setTenPercent] = useState(0);

  useEffect(() => {
    const fetchVendorCount = async () => {
      setLoader(true);
      try {
        // Create a query to fetch all users where role is "vendor"
        const q = query(collection(db, "users"), where("role", "==", "vendor"));

        // Execute the query and get the documents
        const querySnapshot = await getDocs(q);

        // Calculate the total number of vendors
        const totalVendors = querySnapshot.size;

        // Set the vendor count in state
        setVendorCount(totalVendors);
      } catch (error) {
        console.error("Error fetching vendor count:", error);
        toast.error("An error occurred while fetching vendor count.");
      } finally {
        setLoader(false);
      }
    };

    fetchVendorCount();
  }, []);

  useEffect(() => {
    const calculateTotalPrice = async () => {
      try {
        setLoader(true);
        // Fetch all documents from the "bookings" collection
        const querySnapshot = await getDocs(collection(db, "bookings"));

        // Sum up the "price" field from all documents
        let sum = 0;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.price && data.quantity) {
            const total = data.price * data.quantity;
            sum += total;
          }
        });

        // Set the total price in state
        setTotalPrice(sum);

        // Calculate 10% of the total price and set it in state
        const percentage = sum * 0.1;
        setTenPercent(percentage);
      } catch (error) {
        console.error("Error calculating total price:", error);
        toast.error("An error occurred while calculating the total price.");
      } finally {
        setLoader(false);
      }
    };

    calculateTotalPrice();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallDevice(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loader) return <Loader />;

  return isSmallDevice ? (
    <StatSlider tenPercent={tenPercent} vendorCount={vendorCount} />
  ) : (
    <div className="hidden gap-x-10 lg:flex gap-5 lg:w-[100%] flex-row">
      <TransactionCard
        title={`€${tenPercent.toFixed(2)}`}
        content={"Revenue Generated"}
        textColor={"text-secondary"}
      />
      <TransactionCard
        title={vendorCount}
        content={"Total Businesses"}
        textColor={"text-blackTwo"}
      />
    </div>
  );
};

export default CardsRow;

"use client";
import React, { useEffect, useState } from "react";
import Card from "./Card";
import { getUserLocal } from "../../../../redux/slices/loggedInUserSlice";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../app/firebase/config";

const CardsRow = () => {
  const [user, setUser] = useState({});
  const [bagToday, setBagToday] = useState("");
  const [totalBags, setTotalBags] = useState("");

  useEffect(() => {
    const localUser = getUserLocal();
    setUser(localUser);
  }, []);

  useEffect(() => {
    if (user && user.uid) {
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
    } else {
      console.log("user or user.uid is undefined:", user);
    }
  }, [user]);

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

  return (
    <div className="hidden md:block gap-x-10 lg:flex flex-col gap-5">
      <Card
        title={
          totalBags.length === 0 ? 0 : totalBags.length.toLocaleString("en-US")
        }
        content={`Total Bags Made`}
      />
      <Card
        title={Number(bagToday).toLocaleString("en-US")}
        content={`Today's 
          Bag
          `}
      />
    </div>
  );
};

export default CardsRow;


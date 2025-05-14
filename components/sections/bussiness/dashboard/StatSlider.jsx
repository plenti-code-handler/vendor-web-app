"use client";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Card from "./Card";
import { getUserLocal } from "../../../../redux/slices/loggedInUserSlice";
import { collection, getDocs, query, where } from "firebase/firestore";
// import { db } from "../../../../app/firebase/config";

const StatSlider = () => {
  const [current, setCurrent] = useState(0);

  const [user, setUser] = useState({});
  const [bagToday, setBagToday] = useState("");
  const [totalBags, setTotalBags] = useState("");

  useEffect(() => {
    const localUser = getUserLocal();
    setUser(localUser);
  }, []);

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplaySpeed: 3000,
    cssEase: "linear",
    arrows: false,
    initialSlide: 0,
    beforeChange: (prev, next) => {
      setCurrent(next);
    },
    responsive: [
      {
        breakpoint: 1281,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: false,
          dots: false,
        },
      },
      {
        breakpoint: 807,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 765,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
    appendDots: (dots) => (
      <div style={{ position: "relative", bottom: "-10px" }}>
        <ul
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "0px",
            padding: "0px",
            margin: "0px",
          }}
        >
          {dots}
        </ul>
      </div>
    ),
    customPaging: (index) => (
      <div
        className={`h-2 w-2 rounded-full bg-primary ${
          index === current ? "opacity-100" : "opacity-50"
        }`}
      ></div>
    ),
  };

  useEffect(() => {
    if (user && user.uid) {
      // Ensure the user and user.uid are available
      const fetchInitialBags = async () => {
        try {
          // const colRef = collection(db, "bags");
          // const q = query(
          //   colRef,
          //   where("resuid", "==", user.uid) // Adjusted field to resuid
          // );

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
    <Slider {...settings}>
      <div className="px-4">
        <Card
          title={
            totalBags.length === 0
              ? 0
              : totalBags.length.toLocaleString("en-US")
          }
          content={`Total Bag Made`}
        />
      </div>
      <div className="px-4">
        <Card
          title={Number(bagToday).toLocaleString("en-US")}
          content={`Total Orders`}
        />
      </div>
    </Slider>
  );
};

export default StatSlider;

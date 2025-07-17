"use client";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Card from "./Card";
import { getUserLocal } from "../../../../redux/slices/loggedInUserSlice";
import { collection, getDocs, query, where } from "firebase/firestore";

const StatSlider = () => {
  const [current, setCurrent] = useState(0);

  const [user, setUser] = useState({});

  const [totalBags, setTotalBags] = useState("");
  const [totalOrders, setTotalOrders] = useState("");
  useEffect(() => {
    const localUser = getUserLocal();
    const storedBags = localStorage.getItem("Totalbags");
    const storedOrders = localStorage.getItem("Totalorders");
    if (storedBags) setTotalBags(parseInt(storedBags, 0));
    if (storedOrders) setTotalOrders(parseInt(storedOrders, 0));
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

  return (
    <Slider {...settings}>
      <div className="px-4">
        <Card
          title={Number(totalBags).toLocaleString("en-US")}
          content={`Total Bag Made`}
        />
      </div>
      <div className="px-4">
        <Card
          title={Number(totalOrders).toLocaleString("en-US")}
          content={`Total Orders`}
        />
      </div>
    </Slider>
  );
};

export default StatSlider;

"use client";
import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Card from "./Card";

const StatSlider = ({ bagToday, totalBags, vendorCount, customerCount }) => {
  const [current, setCurrent] = useState(0);

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
          infinite: true,
          dots: true,
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
        className={`h-2 w-2 rounded-full bg-secondary ${
          index === current ? "opacity-100" : "opacity-50"
        }`}
      ></div>
    ),
  };

  return (
    <Slider {...settings}>
      <div className="">
        <Card title={vendorCount} content={"Total Businesses"} />
      </div>
      <div className="">
        <Card
          title={
            totalBags.length === 0
              ? 0
              : totalBags.length.toLocaleString("en-US")
          }
          content={"Total Pouch Made"}
        />
      </div>
      <div className="">
        <Card title={customerCount} content={"Total Customers"} />
      </div>
      <div className="">
        <Card
          title={Number(bagToday).toLocaleString("en-US")}
          content={"Today's Total pouches"}
        />{" "}
      </div>
    </Slider>
  );
};

export default StatSlider;

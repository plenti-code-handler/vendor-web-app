"use client";
import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import TransactionCard from "./TransactionCard";

const StatSlider = () => {
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
      <div className="px-4">
        <TransactionCard
          title="€2,786.22"
          content={"Revenue Generated"}
          textColor={"text-secondary"}
          smallScreen={true}
        />
      </div>
      <div className="px-4">
        <TransactionCard
          title="59,786"
          content={"Total Businesses"}
          textColor={"text-blackTwo"}
          smallScreen={true}
        />
      </div>
    </Slider>
  );
};

export default StatSlider;

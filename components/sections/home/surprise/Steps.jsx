import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Custom Navigation Arrows
const CustomNextArrow = ({ onClick }) => (
  <button onClick={onClick} className="     ">
    <svg
      width="30"
      viewBox="0 0 77 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M54.5061 25.4074C53.5753 26.2885 53.0477 27.5121 53.0477 28.7938C53.0477 30.0755 53.578 31.3018 54.5088 32.183C55.3899 33.1138 56.6136 33.6413 57.8952 33.6414C59.1769 33.6414 60.4005 33.1138 61.2817 32.183L75.0123 18.4524C75.3548 18.1098 75.6337 17.7149 75.8382 17.2729C75.7083 16.7177 75.41 16.215 74.9819 15.8311L61.2541 2.10329C59.3344 0.509523 56.5143 0.639369 54.7493 2.40438C52.9843 4.16939 52.8572 6.98671 54.4482 8.9092L57.865 12.3259L4.83195 12.3259C2.16376 12.3259 0.000997926 14.4887 0.000997926 17.1569C0.000997926 19.8251 2.16375 21.9878 4.83195 21.9878L57.865 21.9878L54.5061 25.4074Z"
        fill="#74D5B3"
      />
    </svg>
  </button>
);

const CustomPrevArrow = ({ onClick }) => (
  <button onClick={onClick} className=" rotate-180  ">
    <svg
      width="30"
      viewBox="0 0 77 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M54.5061 25.4074C53.5753 26.2885 53.0477 27.5121 53.0477 28.7938C53.0477 30.0755 53.578 31.3018 54.5088 32.183C55.3899 33.1138 56.6136 33.6413 57.8952 33.6414C59.1769 33.6414 60.4005 33.1138 61.2817 32.183L75.0123 18.4524C75.3548 18.1098 75.6337 17.7149 75.8382 17.2729C75.7083 16.7177 75.41 16.215 74.9819 15.8311L61.2541 2.10329C59.3344 0.509523 56.5143 0.639369 54.7493 2.40438C52.9843 4.16939 52.8572 6.98671 54.4482 8.9092L57.865 12.3259L4.83195 12.3259C2.16376 12.3259 0.000997926 14.4887 0.000997926 17.1569C0.000997926 19.8251 2.16375 21.9878 4.83195 21.9878L57.865 21.9878L54.5061 25.4074Z"
        fill="#74D5B3"
      />
    </svg>
  </button>
);

export default function FoodieFinderCarousel({ heading, image, steps }) {
  const sliderRef = React.useRef(null);

  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    infinite: false,
    adaptiveHeight: true,
  };

  return (
    <div className="flex bg-[#191919] flex-col md:flex-row items-center w-full gap-12 md:gap-16 pl-[5%] pr-[5%] py-[10%] md:pt-[4%] md:pb-[4%]">
      <div className="w-full md:w-1/2 flex flex-col justify-center gap-4 md:gap-6">
        <h2 className="text-main text-[2em] font-bold">{heading}</h2>

        <div className="w-full md:w-4/5">
          <Slider ref={sliderRef} {...settings}>
            {steps.map((step, index) => (
              <div key={index}>
                <div className="flex flex-col gap-5 pr-5">
                  <div className="flex felx-col font-bold justify-center text-[1.2em] items-center rounded-full w-[40px] h-[40px] text-black bg-white">
                    {index + 1}
                  </div>
                  <h3 className="text-white text-[1.5em] font-bold">
                    {step.title}
                  </h3>
                  <p className="text-white  ">{step.description}</p>
                </div>
              </div>
            ))}
          </Slider>
        </div>

        {/* Custom Arrows Below the Slider */}
        <div className="flex   items-center gap-5 mt-5 ">
          <CustomPrevArrow onClick={() => sliderRef.current.slickPrev()} />
          <CustomNextArrow onClick={() => sliderRef.current.slickNext()} />
        </div>
      </div>
      <div className="w-full md:w-1/2 ">
        <img className="rounded-lg" src={image} alt="App Feature" />
      </div>
    </div>
  );
}

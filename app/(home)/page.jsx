"use client";

import React, { useEffect } from "react";
import ContactSection from "../../components/sections/home/ContactSection";

import { setActivePage } from "../../redux/slices/headerSlice";
import { useDispatch } from "react-redux";
import WhyFoodiefinder from "../../components/sections/home/WhyFoodiefinder";
import Steps from "../../components/sections/home/Steps";

import Image_text from "../../components/sections/home/Image_text";
import Banner from "../../components/sections/home/Banner";

const Page = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setActivePage("Home"));
  }, [dispatch]);

  return (
    <div className="text-[75%] md:text[90%] lg:text-[100%] bg-[#F5F5F5]">
      <Banner />

      <Image_text
        heading={"Register now!"}
        paragraph={
          "Download the FoodieFinder app and become part of the solution to foodwaste, whether you are a consumer or a business! For consumers, theapp means access to fantastic offers on food that would otherwise bethrown away - simple, sustainable and good for the wallet. Browserestaurants and stores near you, reserve what you want, and pick upyour finds. <br><br> For companies, FoodieFinder is an opportunity to sellsurplus food, reach new customers and at the same time contribute to amore sustainable world. Reduce your waste costs and make a differenceby connecting to our platform. Together we create positive changes forboth people and the planet. Download the FoodieFinder app today andstart saving food!"
        }
        image={"/home-forth-section.webp "}
        classname={"md:flex-row p-[5%]"}
      />

      <Steps />

      <WhyFoodiefinder />

      <ContactSection />

      <Image_text
        heading={"Our Business Solutions"}
        paragraph={
          "We offer a wide range of solutions that help the world's leading food distributors reduce food waste and ensure that good food does not go to waste."
        }
        image={"/home-fifth-section-2.webp"}
        classname={"md:flex-row pt-[5%] pr-[5%] pl-[5%]"}
      />

      <Image_text
        heading={"Restaurant Panel"}
        paragraph={
          "Easily manage your meal offerings, track orders, and connect with customers. Our intuitive admin panel streamlines operations and helps your restaurant thrive."
        }
        image={"/home-fifth-section-4.webp "}
        classname={"md:flex-row-reverse p-[5%]"}
      />
    </div>
  );
};

export default Page;

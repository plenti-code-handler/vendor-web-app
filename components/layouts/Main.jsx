"use client";
import React from "react";
import BreadCrump from "./Breadcrump";
import Drawers from "./Drawers";

const Main = ({ children }) => {
  return (
    <div className="bg-[#5f22d9]">
      <main className="flex flex-col justify-center md:px-10 md:py-2 bg-white rounded-t-3xl     lg:px-20 lg:py-5  ">
        <BreadCrump />
        {children}
        <Drawers />
      </main>
    </div>
  );
};

export default Main;

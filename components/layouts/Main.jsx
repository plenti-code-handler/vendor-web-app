"use client";
import React from "react";
import BreadCrump from "./Breadcrump";
import Drawers from "./Drawers";

const Main = ({ children }) => {
  return (
    <main className="flex flex-col justify-center lg:px-20 lg:py-5 lg:ml-10 lg:mr-10">
      <BreadCrump />
      {children}
      <Drawers />
    </main>
  );
};

export default Main;

"use client";
import React from "react";
import BreadCrump from "../navigation/Breadcrump";

const Main = ({ children }) => {
  return (
    <main className="flex flex-col justify-center lg:px-20 lg:py-5 lg:mx-10">
      <BreadCrump />
      {children}
      {/* <Drawers /> */}
    </main>
  );
};

export default Main;


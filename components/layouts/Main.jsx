import React from "react";
import BreadCrump from "./Breadcrump";

const Main = ({ children }) => {
  return (
    <main className="flex flex-col justify-center lg:px-20 lg:py-5 lg:ml-10">
      <BreadCrump />
      {children}
    </main>
  );
};

export default Main;

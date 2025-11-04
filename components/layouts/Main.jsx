"use client";
import React from "react";
import BreadCrump from "./Breadcrump";
import Drawers from "./Drawers";

const Main = ({ children }) => {
  return (
    <div className="bg-[#5f22d9] min-h-screen">
      <main className="flex flex-col min-h-screen md:px-10 md:py-2 bg-white rounded-t-3xl lg:px-20 lg:py-5">
        <BreadCrump />
        {children}
        <Drawers />
        
        {/* Footer - pushed to bottom */}
        <footer className="mt-auto pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500 pb-2">
            © 2025 Plenti. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Main;

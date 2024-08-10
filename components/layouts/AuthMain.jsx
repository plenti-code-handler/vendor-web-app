"use client";
import React from "react";
import AuthLeftContent from "./AuthLeftContent";

const AuthMain = ({ children }) => {
  return (
    <main className="flex bg-gray-300 w-full min-h-screen flex-col lg:flex-row justify-center items-center gap-x-[10%] p-4 lg:p-8">
      {/* Left Side */}
      <AuthLeftContent />
      {/* Right Side Content*/}
      {children}
    </main>
  );
};

export default AuthMain;

"use client";
import React from "react";
import AuthLeftContent from "./AuthLeftContent";
import AuthBackground from "./AuthBackground";

const AuthMain = ({ children }) => {
  return (
    <main className="flex bg-[#F7F8FA] w-full z-50 relative min-h-screen flex-col lg:flex-row justify-center items-center gap-x-[10%] p-4 lg:p-8">
      {/* Left Side */}
      <AuthBackground />
      <AuthLeftContent />
      {/* Right Side Content*/}
      {children}
    </main>
  );
};

export default AuthMain;

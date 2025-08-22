import Link from "next/link";
import React from "react";
import { IoSparklesSharp } from "react-icons/io5";



const AuthLeftContent = () => {
  return (
    <div className="relative lg:w-[45%] w-full lg:h-screen flex flex-col">
      {/* Logo positioned at top left */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8 z-10">
        <Link href="/">
          <img
            alt="Plenti Logo"
            src={"/splash-logo.png"}
            className="max-w-[60px] sm:max-w-[80px] md:max-w-[100px] cursor-pointer"
          />
        </Link>
      </div>
      
      {/* Main content - right aligned on mobile, centered on desktop */}
      <div className="flex-1 flex items-center justify-end md:justify-center px-4 md:px-8">
        <div className="text-right md:text-left relative">
          {/* Background gradient overlay for text enhancement */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-transparent rounded-lg"></div>
          
          {/* Main heading with enhanced styling */}
          <h1 className="relative z-10 text-4xl md:text-5xl lg:text-10xl text-white font-black leading-none tracking-tight drop-shadow-2xl">
            <span className="bg-gradient-to-r from-[#EFE5FF] via-white to-[#DAC4FF] bg-clip-text text-transparent">
              join hands to
            </span>
          </h1>
          
          {/* Sub heading with dramatic styling */}
          <h1 className="relative z-10 text-4xl md:text-5xl lg:text-9xl text-white font-black leading-none tracking-tight mt-4 drop-shadow-2xl">
            <span className="bg-gradient-to-r from-[#DAC4FF] via-white to-[#EFE5FF] bg-clip-text text-transparent">
              zero food wastage.
            </span>
            <IoSparklesSharp className="absolute -top-2 -right-2 text-white text-4xl md:text-xl lg:text-2xl drop-shadow-lg" />
          </h1>
          
          {/* Decorative underline */}
          {/* <div className="relative z-10 mt-6 w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg"></div> */}
          
          {/* Floating accent elements */}
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#EFE5FF]/40 rounded-full blur-sm"></div>
          <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-[#DAC4FF]/40 rounded-full blur-sm"></div>
        </div>
      </div>
    </div>
  );
};

export default AuthLeftContent;

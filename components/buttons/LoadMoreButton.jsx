import { loadingCirclesSvg } from "../../svgs";
import React from "react";

const LoadMoreButton = () => {
  return (
    <div className="flex items-center justify-center w-full mt-[2%]">
      <button className="flex items-center justify-center gap-2 rounded-lg transition-all hover:bg-gray-100 w-auto px-4 h-[50px] ">
        <p className="text-[12px] text-[#7E8299] font-semibold">Load More</p>
        {loadingCirclesSvg}
      </button>
    </div>
  );
};

export default LoadMoreButton;

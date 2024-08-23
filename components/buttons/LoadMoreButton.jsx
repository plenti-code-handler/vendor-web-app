import { loadingCirclesSvg } from "../../svgs";
import React from "react";

const LoadMoreButton = ({ loadMore, isLoading }) => {
  return (
    <div className="flex items-center justify-center w-full mt-[2%]">
      <button
        onClick={loadMore}
        disabled={isLoading}
        className={`flex items-center justify-center gap-2 rounded-lg transition-all hover:bg-gray-100 w-auto px-4 h-[50px] ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <p className="text-[12px] text-[#7E8299] font-semibold">
          {isLoading ? "Loading..." : "Load More"}
        </p>
      </button>
    </div>
  );
};

export default LoadMoreButton;

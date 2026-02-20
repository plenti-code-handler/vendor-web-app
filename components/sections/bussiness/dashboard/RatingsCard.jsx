"use client";

import React from "react";
import { StarIcon, ChevronRightIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from "@heroicons/react/24/solid";

const RatingsCard = ({ ratingSummary, onViewMore }) => {
  if (ratingSummary == null) {
    return (
      <div className="flex flex-col h-full border border-gray-200 rounded-xl pt-5 pl-6 pb-4 pr-6 w-full">
        <div className="text-gray-400 text-sm">No rating data</div>
        <div className="flex justify-end mt-auto pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={onViewMore}
            className="inline-flex items-center gap-0.5 text-xs text-gray-500 hover:text-gray-700"
          >
            View more
            <ChevronRightIcon className="w-3.5 h-3.5" />
          </button>
      </div>
      </div>
    );
  }

  const avg = Number(ratingSummary.avg_rating);
  const lagging = ratingSummary.lagging_rating != null ? Number(ratingSummary.lagging_rating) : null;
  const diff = lagging != null ? avg - lagging : null;
  const trendIcon = diff != null ? diff > 0 ? <ArrowTrendingUpIcon className="w-3.5 h-3.5 text-green-500" /> : <ArrowTrendingDownIcon className="w-3.5 h-3.5 text-red-500" /> : null;
  const diffValue = diff != null ? diff > 0 ? <span className="text-green-500">{Math.abs(diff).toFixed(1)}</span> : <span className="text-red-500">{Math.abs(diff).toFixed(1)}</span> : null;
  const numReviews = Number(ratingSummary.num_reviews ?? 0);

  return (
    <div className="flex flex-col h-full border border-gray-200 rounded-xl pt-5 pl-6 pb-4 pr-6 w-full">

      {/* Top: star + rating */}
      <div className="flex items-center justify-start gap-2">
        <StarIcon className="w-6 h-6 text-amber-500 fill-amber-500 shrink-0" />
        
        <span className="text-2xl lg:text-[25px] font-semibold leading-none text-black">
          {avg.toFixed(1)}
        </span>
        
      </div>
      <p className="text-sm text-gray-400 whitespace-nowrap">
        ({numReviews.toLocaleString("en-US")} review{numReviews !== 1 ? "s" : ""})
      </p>

      {/* Trend line */}
      <p className="text-sm text-gray-500 mt-1.5 flex items-center gap-1 flex-wrap">
        {diff === null || diff === 0 ? (
          "No change from last week"
        ) : (
          <>
            Ratings {diff > 0 ? "up" : "down"} by {trendIcon} {diffValue} from last week
          </>
        )}
      </p>

      {/* Bottom right: View more */}
      <div className="flex justify-end mt-auto pt-2 border-t border-gray-100">
        <button
          type="button"
          onClick={onViewMore}
          className="inline-flex items-center gap-0.5 text-xs text-gray-500 hover:text-gray-700"
        >
          View more
          <ChevronRightIcon className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default RatingsCard;
"use client";

import React from "react";
import { StarIcon, ChevronRightIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, CheckBadgeIcon } from "@heroicons/react/24/solid";

const cardBaseClasses = "flex flex-col h-full border border-gray-200 rounded-xl pt-5 pl-6 pb-4 pr-6 w-full text-left transition-all duration-200 ease-out hover:shadow-md hover:border-gray-300 cursor-pointer";

const RatingsCard = ({ ratingSummary, onViewMore }) => {
  if (ratingSummary == null) {
    return (
      <button
        type="button"
        onClick={onViewMore}
        className={cardBaseClasses}
      >
        <div className="text-gray-400 text-sm">No rating data</div>
        <div className="flex justify-end mt-auto pt-2 border-t border-gray-100">
          <span className="inline-flex items-center gap-0.5 text-xs text-gray-500">
            View more
            <ChevronRightIcon className="w-3.5 h-3.5" />
          </span>
        </div>
      </button>
    );
  }

  const avg = Number(ratingSummary.avg_rating);
  const lagging = ratingSummary.lagging_rating != null ? Number(ratingSummary.lagging_rating) : null;
  const rawDiff = lagging != null ? avg - lagging : null;
  const noChange = rawDiff !== null && Math.abs(rawDiff) == 0;
  const diff = rawDiff != null ? Math.abs(rawDiff).toFixed(2) : null;
  const trendIcon = !noChange && rawDiff != null && rawDiff > 0 ? <ArrowTrendingUpIcon className="w-5 h-5 text-green-600" /> : !noChange && rawDiff != null && rawDiff < 0 ? <ArrowTrendingDownIcon className="w-5 h-5 text-red-600" /> : null;
  const diffValue = !noChange && diff != null ? rawDiff > 0 ? <span className="text-green-600 font-semibold text-lg">{diff}</span> : <span className="text-red-500 font-semibold text-lg">{diff}</span> : null;
  const numReviews = Number(ratingSummary.num_reviews ?? 0);

  return (
    <button
      type="button"
      onClick={onViewMore}
      className={cardBaseClasses}
    >
      {/* Top: star + rating */}
      <div className="flex items-center justify-start gap-2">
        <StarIcon className="w-6 h-6 text-amber-500 fill-amber-500 shrink-0" />
        <span className="text-2xl lg:text-[25px] font-semibold leading-none text-black">
          {avg.toFixed(2)}
        </span>
      </div>
      <p className="text-sm text-gray-400 whitespace-nowrap">
        ({numReviews.toLocaleString("en-US")} review{numReviews !== 1 ? "s" : ""})
      </p>

      {/* Trend line */}
      <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1 flex-wrap">
        {rawDiff === null ? (
          "No change from last week"
        ) : noChange ? (
          <>
            <CheckBadgeIcon className="w-5 h-5 text-blue-500 shrink-0" />
            Your ratings didn&apos;t change from last week
          </>
        ) : (
          <>
            Ratings {rawDiff > 0 ? "up" : "down"} by {trendIcon} {diffValue} from last week
          </>
        )}
      </p>

      {/* Bottom right: View more */}
      <div className="flex justify-end mt-auto pt-2 border-t border-gray-100">
        <span className="inline-flex items-center gap-0.5 text-xs text-blue-500">
          View more
          <ChevronRightIcon className="w-3.5 h-3.5" />
        </span>
      </div>
    </button>
  );
};

export default RatingsCard;
import React from "react";

const RatingSummaryBars = ({ averageRating, totalReviews, ratingPercentages = [] }) => {
  const percentages = Array.isArray(ratingPercentages) && ratingPercentages.length >= 5
    ? ratingPercentages
    : [0, 0, 0, 0, 0];

  return (
    <div className="flex justify-between items-center gap-4">
      <div className="text-center shrink-0">
        <p className="text-4xl font-semibold text-gray-900">{averageRating}</p>
        <p className="text-gray-500 text-sm">{totalReviews} Reviews</p>
      </div>

      <div className="flex flex-col gap-2 w-full max-w-sm">
        {[5, 4, 3, 2, 1].map((level) => (
          <div key={level} className="flex items-center gap-2">
            <p className="w-6 text-center text-gray-700 font-medium">{level}</p>
            <div className="relative w-full h-3 bg-gray-200 rounded-md">
              <div
                className="absolute top-0 left-0 h-3 bg-yellow-500 rounded-md transition-all duration-500"
                style={{ width: `${percentages[5 - level]}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingSummaryBars;
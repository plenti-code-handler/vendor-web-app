"use client";
import { placeholderRatingStarSvg, ratingStarSvg } from "../../../../svgs";
import React from "react";
import { formatDistanceToNow } from "date-fns";

const getTimeDifference = (timestamp) => {
  // Check if timestamp exists and has the toDate() method
  if (timestamp && typeof timestamp.toDate === 'function') {
    const date = timestamp.toDate();
    return formatDistanceToNow(date, { addSuffix: true });
  } else {
    // Return a default message or date if the timestamp is missing or invalid
    return "No date available";
  }
};

const CustomerReviews = ({ reviews }) => {
  return (
    <div className="flex flex-col mt-5">
      <p className="text-black font-semibold text-[16px] mb-3">
        Customer's Reviews
      </p>
      
      {reviews.length === 0 ? (
        <p className="text-gray-500">There is no review</p>
      ) : (
        reviews.map((review, index) => (
          <div
            key={index}
            className="flex flex-col gap-1 shadow-md transform translate-y-[-2px] p-2 bg-white rounded-lg lg:w-[100%] mb-3"
          >
            <div className="flex justify-between">
              <div className="flex gap-1 items-center">
                <img
                  alt="User"
                  src={review.imageUrl || "/User.png"}
                  className="rounded-full h-10 w-10 object-cover"
                />
                <p className="font-semibold text-[14px] text-black">
                  {review.username}
                </p>
                <p className="font-medium text-2xl text-dividerComment mb-3">.</p>
                <p className="font-medium text-[12px] text-dividerComment">
                  {getTimeDifference(review.time)}
                </p>
              </div>
              <div className="flex gap-0.5">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) =>
                    i < Math.round(review.rating) ? ratingStarSvg : placeholderRatingStarSvg
                  )}
                </div>
              </div>
            </div>
            <div>
              <p className="text-comment text-[12px] font-medium">
                {review.comment}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CustomerReviews;

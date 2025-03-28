import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import axiosClient from "../../../../AxiosClient";

const Rating = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(
          "/v1/vendor/review/get?skip=0&limit=10"
        );
        if (response.status === 200) {
          setReviews(response.data);
        }
      } catch (error) {
        toast.error(error.response.data.detail);

        console.log(error.response.data.detail);
      }
      setLoading(false);
    };

    fetchReviews();
  }, []);

  const totalReviews = reviews.length;
  const averageRating = totalReviews
    ? (
        reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews
      ).toFixed(1)
    : 0;

  const ratingCounts = [0, 0, 0, 0, 0];
  reviews.forEach((review) => {
    const rating = Math.round(review.rating);
    if (rating >= 1 && rating <= 5) {
      ratingCounts[5 - rating]++;
    }
  });

  const ratingPercentages = ratingCounts.map((count) =>
    totalReviews ? (count / totalReviews) * 100 : 0
  );

  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        <div className="text-center">
          <p className="text-4xl font-bold text-gray-900">{averageRating}</p>
          <p className="text-gray-500 text-sm">{totalReviews} Reviews</p>
        </div>

        <div className="flex flex-col gap-2 w-full max-w-sm">
          {[5, 4, 3, 2, 1].map((level, index) => (
            <div key={level} className="flex items-center gap-2">
              <p className="w-6 text-center text-gray-700 font-medium">
                {level}
              </p>
              <div className="relative w-full h-3 bg-gray-200 rounded-md">
                <div
                  className="absolute top-0 left-0 h-3 bg-yellow-500 rounded-md transition-all duration-500"
                  style={{ width: `${ratingPercentages[5 - level]}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold text-gray-800">Recent Reviews</h2>
        <div className="space-y-4 mt-4">
          {loading ? (
            <p className="text-gray-500">Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet.</p>
          ) : (
            reviews.map((review) => (
              <div
                key={review.id}
                className="p-4 bg-gray-100 rounded-lg shadow-sm animate-fade-in"
              >
                <p className="text-yellow-500 font-semibold">
                  {"★".repeat(review.rating) + "☆".repeat(5 - review.rating)}
                </p>
                <p className="mt-1 text-gray-800">{review.review}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(review.created_at * 1000).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Rating;

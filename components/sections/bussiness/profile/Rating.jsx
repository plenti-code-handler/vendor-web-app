import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../app/firebase/config";
import { useSelector } from "react-redux";
import CustomerReviews from "./CustomerReviews";
import { starSvg } from "../../../../svgs";
import { getUserLocal } from "../../../../redux/slices/loggedInUserSlice";

const Rating = () => {
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState({});

  const successOpen = useSelector((state) => state.withdrawSuccess.drawerOpen);
  const amountOpen = useSelector((state) => state.withdrawAmount.drawerOpen);

  // Fetch user and reviews
  useEffect(() => {
    const user = getUserLocal();
    if (user) {
      setUser(user);
    }
  }, []);

  useEffect(() => {
    const fetchUserReviews = async () => {
      if (!user || !user.uid) return;

      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          if (userData.reviews) {
            setReviews(userData.reviews);
          } else {
            setReviews([]); // No reviews available
          }
        } else {
          console.log("No such document!");
          setReviews([]); // Document doesn't exist
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchUserReviews();
  }, [user]);

  // Calculate total number of reviews
  const totalReviews = reviews.length;

  // Calculate average rating
  const averageRating = reviews.length
    ? (
        reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews
      ).toFixed(1)
    : 0; // If no reviews, show 0

  // Calculate the percentage of each rating level (1 to 5 stars)
  const ratingCounts = [0, 0, 0, 0, 0]; // Array to hold counts for 1, 2, 3, 4, 5 star ratings

  // Count the number of reviews for each rating
  reviews.forEach((review) => {
    const roundedRating = Math.round(review.rating); // Round rating to nearest integer
    if (roundedRating >= 1 && roundedRating <= 5) {
      ratingCounts[5 - roundedRating]++; // Correct mapping for star ratings
    }
  });

  // Convert counts to percentages for each rating
  const ratingDistribution = ratingCounts.map((count) => {
    return totalReviews > 0 ? (count / totalReviews) * 100 : 0;
  });

  // Calculate the percentage for each rating level
  const ratingPercentages = ratingCounts.map((count) => {
    return totalReviews ? (count / totalReviews) * 100 : 0;
  });

  return (
    <div className="flex flex-col w-full pt-[30px] pb-[30px]">
      <div className="flex gap-8">
        {/* Rating Bars */}
        <div className="flex flex-col gap-2 flex-1">
          {[5, 4, 3, 2, 1].map((level, index) => (
            <div key={level} className="flex items-center gap-2">
              <p className="w-6 text-center">{level}</p>
              <div className="relative flex-1">
                <div
                  className={`absolute inset-0 bg-[#FFB400] rounded-sm ${
                    successOpen || amountOpen ? "" : "z-10"
                  }`}
                  style={{
                    width: `${ratingPercentages[5 - level]}%`,
                    height: "10px",
                  }}
                ></div>
                <div
                  className="absolute inset-0 bg-gray-200 rounded-sm"
                  style={{ height: "10px" }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Feedback Summary */}
        <div className="flex flex-col items-start flex-shrink-0 justify-center">
          <div className="flex items-center gap-2">
            <p className="text-black text-[40px] font-bold">{averageRating}</p>
            {starSvg}
          </div>
          <p className="text-[#9796A1] text-sm font-medium mt-1">
            {totalReviews} Reviews
          </p>
        </div>
      </div>
      {/* Pass reviews as props to CustomerReviews */}
      <CustomerReviews reviews={reviews} />
    </div>
  );
};

export default Rating;

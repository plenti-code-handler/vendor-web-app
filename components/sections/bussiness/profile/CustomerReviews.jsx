"use client";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../app/firebase/config";
import { placeholderRatingStarSvg, ratingStarSvg } from "../../../../svgs";
import React, { useEffect, useState } from "react";
import { getUserLocal } from "../../../../redux/slices/loggedInUserSlice";
import { formatDistanceToNow } from "date-fns";

const getTimeDifference = (timestamp) => {
  // Convert the Firebase timestamp to a JavaScript Date object
  const date = timestamp.toDate();

  // Calculate the distance to now
  return formatDistanceToNow(date, { addSuffix: true });
};

const CustomerReviews = () => {
  const [user, setUser] = useState({});
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const user = getUserLocal();
    if (user) {
      setUser(user);
    }
  }, []);

  useEffect(() => {
    const fetchUserCategories = async () => {
      if (!user || !user.uid) return; // Ensure user is available

      try {
        const userDocRef = doc(db, "users", user.uid); // Reference to user document
        const userDocSnapshot = await getDoc(userDocRef); // Fetch document snapshot

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          if (userData.reviews) {
            setReviews(userData.reviews);
          } else {
            setReviews([]); // Handle case where `reviews` field is missing
          }
        } else {
          console.log("No such document!");
          setReviews([]); // Handle case where document does not exist
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchUserCategories();
  }, [user]); // Ensure fetch runs when `user` changes

  return (
    <div className="flex flex-col mt-5">
      <p className="text-black font-semibold text-[16px] mb-3">
        Customer's Reviews
      </p>
      {reviews.map((review, index) => (
        <div
          key={index}
          className="flex flex-col gap-1 shadow-md transform translate-y-[-2px] p-2 bg-white rounded-lg lg:w-[100%]"
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
                {[...Array(5)].map((_, index) =>
                  index < review.rating
                    ? ratingStarSvg
                    : placeholderRatingStarSvg
                )}
              </div>
            </div>
            {/* <div className="flex gap-0.5">
              {ratingStarSvg}
              {ratingStarSvg}
              {ratingStarSvg}
              {ratingStarSvg}
              {placeholderRatingStarSvg}
            </div> */}
          </div>
          <div>
            <p className="text-comment text-[12px] font-medium">
              {review.comment}
            </p>
          </div>
        </div>
      ))}
      {/* <div className="flex flex-col gap-1 shadow-md transform translate-y-[-2px] p-2 bg-white rounded-lg lg:w-[100%]">
        <div className="flex justify-between">
          <div className="flex gap-1 items-center">
            <img
              alt="User"
              src="/User.png"
              className="rounded-full h-10 w-10 object-cover"
            />
            <p className="font-semibold text-[14px] text-black">Deepak Kumar</p>
            <p className="font-medium text-2xl text-dividerComment mb-3">.</p>
            <p className="font-medium text-[12px] text-dividerComment">
              2d ago
            </p>
          </div>
          <div className="flex gap-0.5">
            {ratingStarSvg}
            {ratingStarSvg}
            {ratingStarSvg}
            {ratingStarSvg}
            {placeholderRatingStarSvg}
          </div>
        </div>
        <div>
          <p className="text-comment text-[12px] font-medium">
            Et vero qui aspernatur repellendus molestiae. Tempora reiciendis aut
            beatae beatae eos aut. Quia ut minima consequuntur aut est enim.
          </p>
        </div>
      </div> */}
    </div>
  );
};

export default CustomerReviews;

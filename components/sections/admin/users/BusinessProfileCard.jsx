"use client";

import { useDispatch, useSelector } from "react-redux";
import { businessStarSvg, locationIconSvg } from "../../../../svgs";
import React, { useEffect, useState } from "react";
import { setActivePage } from "../../../../redux/slices/headerSlice";
import { useRouter } from "next/navigation";

const BusinessProfileCard = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [categories, setCategories] = useState([]);
  const [averageRating, setAverageRating] = useState(0); // State to hold the average rating

  const dispatch = useDispatch();
  const router = useRouter();

  const business = useSelector(
    (state) => state.selectBusiness.selectedBusiness
  );

  useEffect(() => {
    if (!business || Object.keys(business).length === 0) {
      router.push("/admin/users");
    } else {
      setName(business.name);
      setDescription(business.desc);
      setImage(business.imageUrl);
      setLocation(business.loc);
      setCategories(business.categories);

      // Calculate average rating from reviews
      if (business.reviews && business.reviews.length > 0) {
        const totalRating = business.reviews.reduce((sum, review) => sum + review.rating, 0);
        const average = totalRating / business.reviews.length;
        setAverageRating(average);
      } else {
        setAverageRating(0); // No reviews
      }
    }
  }, [business, router]);

  useEffect(() => {
    dispatch(setActivePage("Users"));
  }, [dispatch]);

  return (
    <>
      <div className="flex space-x-4">
        <img
          alt="User"
          src={image  }
          className="rounded-full h-24 w-24 sm:h-40 sm:w-40 object-cover"
        />
        <div className="flex gap-5">
          <div className="flex flex-col lg:mt-5 lg:gap-y-2">
            <p className="text-lg font-semibold text-gray-900">{name}</p>
            <div className="flex items-center text-grayOne font-semibold space-x-2">
              {locationIconSvg}
              <p className="text-sm">{location}</p>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {categories &&
                categories.map((category) => (
                  <div
                    key={category.id}
                    className="bg-mainThree border border-mainThree rounded-md px-3 py-1"
                  >
                    <p className="text-mainTwo text-sm font-medium">
                      {category.name}
                    </p>
                  </div>
                ))}
            </div>
          </div>
          <div className="flex flex-col items-center lg:mt-5 lg:gap-y-2 lg:ml-12 md:gap-y-2 md:ml-12">
            <p className="text-black font-semibold text-[14px]">Rating</p>
            <div className="flex gap-2 items-center">
              {businessStarSvg}
              <p className="text-starItem font-bold text-[18px]">{averageRating.toFixed(1)}</p> {/* Display the average rating */}
            </div>
          </div>
        </div>
      </div>
      <p className="text-left leading-5 text-graySeven font-medium text-[16px]">
        {description}
      </p>
    </>
  );
};

export default BusinessProfileCard;

 




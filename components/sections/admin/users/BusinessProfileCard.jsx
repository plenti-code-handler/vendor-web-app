"use client";

import { useDispatch, useSelector } from "react-redux";
import { businessStarSvg, locationIconSvg } from "../../../../svgs";
import React, { useEffect, useState } from "react";
import { setActivePage } from "../../../../redux/slices/headerSlice";
import { useRouter } from "next/navigation";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../../app/firebase/config";

const BusinessProfileCard = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [categories, setCategories] = useState([]);
  const [averageRating, setAverageRating] = useState(0); // State to hold the average rating
  const [bankDetails, setBankDetails] = useState({});
  const [totalRevenue, setTotalRevenue] = useState("");
  const [loader, setLoader] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const business = useSelector(
    (state) => state.selectBusiness.selectedBusiness
  );

  useEffect(() => {
    if (!business || Object.keys(business).length === 0) {
      router.push("/admin/users");
    } else {
      setEmail(business.email);
      setPhone(business.phone);
      setName(business.name);
      setDescription(business.desc);
      setImage(business.imageUrl);
      setLocation(business.loc);
      setCategories(business.categories);
      if (business.bankDetails) {
        setBankDetails(business.bankDetails);
      }
      // Calculate average rating from reviews
      if (business.reviews && business.reviews.length > 0) {
        const totalRating = business.reviews.reduce(
          (sum, review) => sum + review.rating,
          0
        );
        const average = totalRating / business.reviews.length;
        setAverageRating(average);
      } else {
        setAverageRating(0); // No reviews
      }
    }
  }, [business, router]);

  useEffect(() => {
    if (business.uid) {
      const fetchInitialBookings = async () => {
        try {
          setLoader(true);
          const colRef = collection(db, "bookings");
          const q = query(colRef, where("vendorid", "==", business.uid));

          const allBookingsSnapshot = await getDocs(q);
          const bookingsData = await Promise.all(
            allBookingsSnapshot.docs.map(async (entry) => {
              const booking = {
                id: entry.id,
                ...entry.data(),
              };

              const userDocRef = doc(db, "users", booking.uid);
              const userDocSnap = await getDoc(userDocRef);

              const bagDocRef = doc(db, "bags", booking.bagid);
              const bagDocSnap = await getDoc(bagDocRef);

              if (userDocSnap.exists() && bagDocSnap.exists()) {
                const userData = userDocSnap.data();
                const bagData = bagDocSnap.data();
                return {
                  ...booking,
                  user: userData,
                  bag: bagData,
                };
              } else {
                return booking;
              }
            })
          );

          // Calculate total revenue
          const totalRevenue = bookingsData.reduce((acc, booking) => {
            return acc + (booking.price || 0); // Ensure to handle cases where price might be undefined
          }, 0);

          // Calculate 90% of total revenue
          const ninetyPercentRevenue = totalRevenue * 0.85;

          // Store the calculated value
          setTotalRevenue(ninetyPercentRevenue);
        } catch (error) {
          console.error("Error fetching bookings:", error);
        } finally {
          setLoader(false);
        }
      };

      fetchInitialBookings();
    } else {
      console.log("business.uid is undefined:", business.uid);
    }
  }, [business.uid]);

  useEffect(() => {
    dispatch(setActivePage("Users"));
  }, [dispatch]);

  return (
    <>
      <div className="flex space-x-4">
        <img
          alt="User"
          src={image}
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
              <p className="text-starItem font-bold text-[18px]">
                {averageRating.toFixed(1)}
              </p>{" "}
              {/* Display the average rating */}
            </div>
          </div>
          <div className="flex flex-col items-center lg:mt-5 lg:gap-y-2 lg:ml-12 md:gap-y-2 md:ml-12">
            <p className="text-black font-semibold text-[14px]">
              Total Revenue
            </p>
            <div className="flex gap-2 items-center text-starItem font-bold">
              SEK
              <p className="text-starItem font-bold text-[18px]">
                {Number(totalRevenue).toFixed(2)}
              </p>{" "}
            </div>
          </div>
        </div>
      </div>
      <div>
        <p className="text-left text-graySeven  text-[16px]">
          <span className="font-bold">Email: </span>
          {email}
        </p>
        <p className="text-left text-graySeven  text-[16px]">
          <span className="font-bold">Phone Number: </span>
          {phone}
        </p>
        <p className="text-left text-graySeven  text-[16px]">
          <span className="font-bold">IBAN: </span>
          {bankDetails.iban}
        </p>
        <p className="text-left text-graySeven text-[16px]">
          <span className="font-bold">Account Holder Name: </span>
          {bankDetails.accountHolder}
        </p>
        <p className="text-left text-graySeven text-[16px]">
          <span className="font-bold">VAT Number: </span>
          {bankDetails.vat}
        </p>
      </div>
      <p className="text-left leading-5 text-graySeven font-medium text-[16px]">
        {description}
      </p>
    </>
  );
};

export default BusinessProfileCard;

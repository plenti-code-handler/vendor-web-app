"use client";

import React, { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import TableUpper from "./TableUpper";
import { db } from "../../../../app/firebase/config";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  where,
  getDoc,
  doc,
} from "firebase/firestore";
import LoadMoreButton from "../../../buttons/LoadMoreButton";
import { getUserLocal } from "../../../../redux/slices/loggedInUserSlice";
import { convertTimestampToDDMMYYYY } from "../../../../utility/date";
import Loader from "../../../loader/loader";

const RecentOrders = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  const [user, setUser] = useState({});
  const [countryCode, setCountryCode] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCountryCode = JSON.parse(localStorage.getItem("countryCode"));
      setCountryCode(storedCountryCode);
    }
  }, []);

  useEffect(() => {
    const localUser = getUserLocal();
    setUser(localUser);
  }, []);

  useEffect(() => {
    if (user && user.uid) {
      // Ensure the user and user.uid are available
      const fetchInitialBookings = async () => {
        try {
          setLoader(true);
          const colRef = collection(db, "bookings");
          const q = query(
            colRef,
            where("vendorid", "==", user.uid),
            // orderBy("time"),
            limit(5)
          );

          const allBookingsSnapshot = await getDocs(q);
          const bookingsData = await Promise.all(
            allBookingsSnapshot.docs.map(async (entry) => {
              const booking = entry.data();

              // Fetch user data based on the user ID in the booking
              const userDocRef = doc(db, "users", booking.uid); // Assuming booking.uid is the field for user ID
              const userDocSnap = await getDoc(userDocRef);

              if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                return {
                  ...booking,
                  user: userData, // Merge user data with booking
                };
              } else {
                console.log("User data not found for UID:", booking.uid);
                return booking; // Return booking without user data if not found
              }
            })
          );
          const lastDoc =
            allBookingsSnapshot.docs[allBookingsSnapshot.docs.length - 1];

          setBookings(bookingsData);
          setFilteredBookings(bookingsData);
          setLastVisible(lastDoc);
        } catch (error) {
          console.error("Error fetching bookings:", error);
        } finally {
          setLoader(false);
        }
      };

      fetchInitialBookings();
    } else {
      console.log("user or user.uid is undefined:", user);
    }
  }, [user]);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredBookings(bookings);
    } else {
      const filtered = bookings.filter(
        (booking) =>
          booking.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBookings(filtered);
    }
  }, [searchTerm, bookings]);

  if (loader) {
    return <Loader />;
  }

  const fetchMoreBookings = async () => {
    // Prevent the function from running if it’s already loading
    if (loading) return;

    try {
      setLoading(true);
      const colRef = collection(db, "bookings");

      let q;
      if (lastVisible) {
        // If lastVisible exists, start after it and apply the where clause
        q = query(
          colRef,
          where("vendorid", "==", user.uid),
          // orderBy("time"),
          startAfter(lastVisible),
          limit(5)
        );
      } else {
        // If lastVisible is null, apply the where clause, order, and limit
        q = query(
          colRef,
          where("vendorid", "==", user.uid),
          // orderBy("time"),
          limit(5)
        );
      }

      const allBookingsSnapshot = await getDocs(q);

      // Handle empty snapshots (end of collection)
      if (allBookingsSnapshot.empty) {
        console.log("No more bookings to fetch");
        setLoading(false);
        return;
      }

      const bookingsData = await Promise.all(
        allBookingsSnapshot.docs.map(async (entry) => {
          const booking = entry.data();

          // Fetch user data based on the user ID in the booking
          const userDocRef = doc(db, "users", booking.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            return {
              ...booking,
              user: userData, // Merge user data with booking
            };
          } else {
            console.log("User data not found for UID:", booking.uid);
            return booking; // Return booking without user data if not found
          }
        })
      );

      // Determine the last document for pagination
      const lastDoc =
        allBookingsSnapshot.docs[allBookingsSnapshot.docs.length - 1];

      // Update state with new data
      setBookings((prevBookings) => [...prevBookings, ...bookingsData]);
      setFilteredBookings((prevBookings) => [...prevBookings, ...bookingsData]);
      setLastVisible(lastDoc); // Set the last visible document for pagination
    } catch (error) {
      console.error("Error fetching more bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 w-full border border-gray-200 rounded-xl p-6 sm:px-4">
      <TableUpper setSearchTerm={setSearchTerm} />
      <div className="no-scrollbar w-full overflow-y-hidden">
        <table className="w-full table-auto truncate overflow-hidden bg-white">
          <thead>
            <tr className="border-b-[1px] border-grayOne border-dashed border-opacity-45 text-sm font-semibold text-grayOne">
              <th className="pb-[8px] pl-[5%] pt-[18px] text-left w-[18.00%]">
                CUSTOMER
              </th>
              <th className="pb-[8px] px-2 pt-[18px] text-center">Deal Name</th>
              <th className="pb-[8px] px-2 pt-[18px] text-center">Size</th>
              <th className="pb-[8px] px-2 pt-[18px] text-center">Quantity</th>
              <th className="pb-[8px] px-2 pt-[18px] text-center">Amount</th>
              <th className="pb-[8px] px-2 pt-[18px] text-center">
                Order Date
              </th>
              <th className="pb-[8px] px-2 pt-[18px] text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking, index) => (
                <tr
                  key={index}
                  className="cursor-pointer border-b-[1px] border-[#E4E4E4] border-dashed hover:bg-[#f8f7f7]"
                >
                  <td className="truncate pl-2 lg:pl-[5%] pr-6   md:pr-2 w-[14.28%]">
                    <div className="py-3">
                      <div className="flex flex-row items-center gap-x-2">
                        <div className="flex h-[40px] w-[40px] items-center justify-center overflow-hidden rounded-full">
                          <Image
                            src={`/Round-${booking.size}.png`}
                            alt="User"
                            className="h-full w-full object-cover"
                            width={40}
                            height={40}
                            priority
                          />
                        </div>
                        <div className="flex flex-col gap-y-1">
                          <p className="text-sm font-medium truncate overflow-hidden whitespace-nowrap  ">
                            {booking.username.length > 15
                              ? `${booking.username.slice(0, 15)}...`
                              : booking.username}
                          </p>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="truncate text-center px-2">
                    <p className="text-sm font-semibold text-grayThree truncate overflow-hidden whitespace-nowrap  ">
                      {booking.name.length > 15
                        ? `${booking.name.slice(0, 15)}...`
                        : booking.name}
                    </p>
                  </td>
                  <td className="truncate text-center px-2">
                    <p className="text-sm font-semibold text-grayThree">
                      {booking.size}
                    </p>
                  </td>
                  <td className="truncate text-center px-2">
                    <p className="text-sm font-semibold text-grayThree">
                      {booking.quantity}
                    </p>
                  </td>
                  <td className="truncate text-center px-2">
                    <p className="text-sm font-semibold text-grayThree">
                      {countryCode ? countryCode : "SEK"} {booking.price}
                    </p>
                  </td>
                  <td className="truncate text-center px-2">
                    <p className="text-sm font-semibold text-grayThree">
                      {convertTimestampToDDMMYYYY(booking.bookingdate)}
                    </p>
                  </td>
                  <td className="truncate text-center px-2">
                    <div
                      className={`mx-auto ${
                        booking.status.toLowerCase() == "picked"
                          ? "bg-pickedBg text-pickedText "
                          : booking.status.toLowerCase() == "cancelled"
                          ? "bg-notPickedBg text-notPickedText"
                          : "bg-notPickedBg text-notPickedText"
                      } font-semibold rounded-[4px] text-[12px] w-[77px] h-[26px] p-1 `}
                    >
                      <p>
                        {booking.status.toLowerCase() === "picked"
                          ? "Picked"
                          : booking.status.toLowerCase() === "cancelled"
                          ? "Cancelled"
                          : "Not Picked"}
                      </p>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center py-10 text-grayOne">
                  No Orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <LoadMoreButton loadMore={fetchMoreBookings} isLoading={loading} />
    </div>
  );
};

export default RecentOrders;

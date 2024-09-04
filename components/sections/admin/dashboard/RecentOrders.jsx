"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import TableUpper from "./TableUpper";
import { users } from "../../../../lib/constant_data";
import LoadMoreButton from "../../../buttons/LoadMoreButton";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import { db } from "../../../../app/firebase/config";
import { convertTimestampToDDMMYYYY } from "../../../../utility/date";
import Loader from "../../../loader/loader";

const RecentOrders = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    // Ensure the user and user.uid are available
    const fetchInitialBookings = async () => {
      try {
        setLoader(true);
        const colRef = collection(db, "bookings");
        const q = query(
          colRef,
          // orderBy("time"),
          limit(10)
        );

        const allBookingsSnapshot = await getDocs(q);
        const bookingsData = await Promise.all(
          allBookingsSnapshot.docs.map(async (entry) => {
            const booking = entry.data();

            // Fetch user data based on the user ID in the booking
            const userDocRef = doc(db, "users", booking.uid); // Assuming booking.uid is the field for user ID
            const userDocSnap = await getDoc(userDocRef);

            const bagDocRef = doc(db, "bags", booking.bagid);
            const bagDocSnap = await getDoc(bagDocRef);

            if (userDocSnap.exists() && bagDocSnap.exists()) {
              const userData = userDocSnap.data();
              const bagData = bagDocSnap.data();
              return {
                ...booking,
                user: userData, // Merge user data with booking
                bag: bagData,
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
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredBookings(bookings);
    } else {
      // const filtered = bookings.filter((booking) => {
      const filtered = bookings.filter((booking) => {
        return (
          booking.user.username
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          booking.bag.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
      setFilteredBookings(filtered);
    }
  }, [
    searchTerm,
    // bookings
  ]);

  const fetchMoreBookings = async () => {
    try {
      if (lastVisible) {
        setLoading(true);
        const colRef = collection(db, "bookings");
        const q = query(
          colRef,
          // orderBy("time"),
          startAfter(lastVisible), // Start after the last visible document
          limit(10) // Fetch the next 10 bookings
        );

        const newBookingsSnapshot = await getDocs(q);
        const newBookingsData = await Promise.all(
          newBookingsSnapshot.docs.map(async (entry) => {
            const booking = entry.data();

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
              console.log("User data not found for UID:", booking.uid);
              return booking; // Return booking without user data if not found
            }
          })
        );

        const lastDoc =
          newBookingsSnapshot.docs[newBookingsSnapshot.docs.length - 1];

        setBookings((prevBookings) => [...prevBookings, ...newBookingsData]);
        setFilteredBookings((prevFiltered) => [
          ...prevFiltered,
          ...newBookingsData,
        ]);
        setLastVisible(lastDoc);
      }
    } catch (error) {
      console.error("Error fetching more bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loader) return <Loader />;

  return (
    <div className="mt-4 w-full border border-gray-300 rounded-xl p-6 sm:px-4">
      <TableUpper setSearchTerm={setSearchTerm} />
      <div className="no-scrollbar w-full  overflow-y-hidden">
        <table className="w-full table-auto truncate overflow-hidden bg-white">
          <thead>
            <tr className="border-b-[1px] border-grayOne border-dashed border-opacity-30 text-sm font-semibold text-grayOne">
              <th className="pb-[8px] pl-2 pt-[18px] text-left w-[14.28%]">
                CUSTOMER
              </th>
              <th className="pb-[8px] pl-2 pt-[18px] text-left w-[14.28%]">
                Deal Name
              </th>
              {/* <th className="pb-[8px] px-2 pt-[18px] text-center">Deal Name</th> */}
              <th className="pb-[8px] px-2 pt-[18px] text-center">Size</th>
              <th className="pb-[8px] px-2 pt-[18px] text-center">Quantity</th>
              <th className="pb-[8px] px-2 pt-[18px] text-center">Amount</th>
              <th className="pb-[8px] px-2 pt-[18px] text-center">
                Order Date
              </th>
              <th className="pb-[8px] px-3 pt-[18px] text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking, index) => (
                <tr
                  key={index}
                  className="cursor-pointer border-b-[1px] border-[#E4E4E4] border-dashed hover:bg-[#f8f7f7]"
                >
                  <td className="truncate pl-2 pr-2 w-[17.00%]">
                    <div className="py-3">
                      <div className="flex flex-row items-center gap-x-2">
                        <div className="flex h-[40px] w-[40px] items-center justify-center overflow-hidden rounded-full">
                          <Image
                            src={booking.user.imageUrl || "./User.png"}
                            alt="GetSpouse Logo"
                            className="h-full w-full object-cover"
                            width={40}
                            height={40}
                            priority
                          />
                        </div>
                        <div className="flex flex-col gap-y-1">
                          <p className="text-sm font-medium">
                            {booking.user.username}
                          </p>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="truncate pl-2 pr-2 w-[17.00]">
                    <div className="py-3">
                      <div className="flex flex-row items-center gap-x-2">
                        <div className="flex h-[40px] w-[40px] items-center justify-center overflow-hidden rounded-full">
                          <Image
                            src={booking.bag.img || "/User.png"}
                            alt="GetSpouse Logo"
                            className="h-full w-full object-cover"
                            width={40}
                            height={40}
                            priority
                          />
                        </div>
                        <div className="flex flex-col gap-y-1">
                          <p className="text-sm font-medium">
                            {booking.bag.title}
                          </p>
                        </div>
                      </div>
                    </div>
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
                      € {booking.price}
                    </p>
                  </td>
                  <td className="truncate text-center px-2">
                    <p className="text-sm font-semibold text-grayThree">
                      {convertTimestampToDDMMYYYY(booking.bookingdate)}
                    </p>
                  </td>
                  <td className="truncate text-center justify-center items-center">
                    <div
                      className={`mx-auto ${
                        booking.status.toLowerCase() == "picked"
                          ? "bg-pickedBg text-pickedText "
                          : "bg-notPickedBg text-notPickedText"
                      } font-semibold rounded-[4px] text-[12px] w-[77px] h-[26px] p-1 `}
                    >
                      <p>
                        {booking.status.toLowerCase() === "picked"
                          ? "Picked"
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

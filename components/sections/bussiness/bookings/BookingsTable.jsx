"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import TableUpper from "./TableUpper";
import { bookings } from "../../../../lib/constant_data";
import { useDispatch } from "react-redux";
import { setActivePage } from "../../../../redux/slices/headerSlice";
import StatusDropdown from "./StatusDropdown";
import LoadMoreButton from "../../../buttons/LoadMoreButton";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../../app/firebase/config";

const BookingsTable = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setActivePage("Bookings"));
  }, [dispatch]);

  const handleStatusChange = async (newStatus, bookingId) => {
    const docRef = doc(db, "bookings", bookingId);
    await updateDoc(docRef, {
      status: newStatus,
    });
  };

  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInitialBookings();
  }, []);

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

  const fetchInitialBookings = async () => {
    const colRef = collection(db, "bookings");
    const q = query(colRef, orderBy("time"), limit(10)); // Adjust limit as needed

    const allBookingsSnapshot = await getDocs(q);

    const bookingsData = allBookingsSnapshot.docs.map((doc) => ({
      id: doc.id, // Extract the ID here
      ...doc.data(), // Spread the rest of the document data
    }));
    const lastDoc =
      allBookingsSnapshot.docs[allBookingsSnapshot.docs.length - 1];

    setBookings(bookingsData);
    setFilteredBookings(bookingsData);
    setLastVisible(lastDoc);
  };

  const fetchMoreBookings = async () => {
    // Prevent the function from running if it’s already loading
    if (loading) return;

    try {
      setLoading(true);

      const colRef = collection(db, "bookings");
      let q;

      if (lastVisible) {
        // If lastVisible exists, start after it
        q = query(colRef, orderBy("time"), startAfter(lastVisible), limit(10));
      } else {
        // If lastVisible is null, just order and limit
        q = query(colRef, orderBy("time"), limit(10));
      }

      const allBookingsSnapshot = await getDocs(q);

      // Handle empty snapshots (end of collection)
      if (allBookingsSnapshot.empty) {
        console.log("No more bookings to fetch");
        setLoading(false);
        return;
      }

      const bookingsData = allBookingsSnapshot.docs.map((doc) => doc.data());
      const lastDoc =
        allBookingsSnapshot.docs[allBookingsSnapshot.docs.length - 1];

      // Update state with new data
      setBags((prevBookings) => [...prevBookings, ...bookingsData]);
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
            {filteredBookings.map((booking, index) => (
              <tr
                key={index}
                className="cursor-pointer border-b-[1px] border-[#E4E4E4] border-dashed hover:bg-[#f8f7f7]"
              >
                <td className="truncate pl-2 lg:pl-[5%] pr-2 w-[14.28%]">
                  <div className="py-3">
                    <div className="flex flex-row items-center gap-x-2">
                      <div className="flex h-[40px] w-[40px] items-center justify-center overflow-hidden rounded-full">
                        <Image
                          src={booking.userimg ? booking.userimg : "/User.png"}
                          alt="GetSpouse Logo"
                          className="h-full w-full object-cover"
                          width={40}
                          height={40}
                          priority
                        />
                      </div>
                      <div className="flex flex-col gap-y-1">
                        <p className="text-sm font-medium">
                          {booking.username}
                        </p>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="truncate text-center px-2">
                  <p className="text-sm font-semibold text-grayThree">
                    {booking.name}
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
                    € {booking.price}
                  </p>
                </td>
                <td className="truncate text-center px-2">
                  <p className="text-sm font-semibold text-grayThree">
                    {booking.start}
                  </p>
                </td>
                <td className="truncate text-center px-2">
                  <StatusDropdown
                    initialStatus={booking.status}
                    onStatusChange={(newStatus) =>
                      handleStatusChange(newStatus, booking.id)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <LoadMoreButton loadMore={fetchMoreBookings} isLoading={loading} />
    </div>
  );
};

export default BookingsTable;

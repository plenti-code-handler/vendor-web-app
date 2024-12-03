"use client";
import React, { useEffect, useState } from "react";
import DetailsTableUpper from "./DetailsTableUpper";
import { users } from "../../../../lib/constant_data";
import LoadMoreButton from "../../../buttons/LoadMoreButton";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { db } from "../../../../app/firebase/config";
import { useSelector } from "react-redux";
import { convertTimestampToDDMMYYYY } from "../../../../utility/date";
import StatusDropdown from "../../bussiness/bookings/StatusDropdown";
import Loader from "../../../loader/loader";
import Image from "next/image";

const CustomerDetailTable = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bookingFilter, setOnBookingFilter] = useState("active");
  const [loader, setLoader] = useState(false);
  const [currLang, setCurrLang] = useState("en");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedLang = localStorage.getItem("lang");
      setCurrLang(storedLang);
      if (storedLang) {
        setCurrLang(storedLang);
      }
    }
  }, []);

  const customer = useSelector(
    (state) => state.selectBusiness.selectedBusiness
  );

  const handleStatusChange = async (newStatus, bookingId) => {
    const docRef = doc(db, "bookings", bookingId);
    await updateDoc(docRef, {
      status: newStatus,
    });
    const colRef = collection(db, "bookings");
    const q = query(
      colRef,
      where("vendorid", "==", user.uid),
      // orderBy("time"),
      limit(10)
    );

    const allBookingsSnapshot = await getDocs(q);
    const bookingsData = await Promise.all(
      allBookingsSnapshot.docs.map(async (entry) => {
        const booking = {
          id: entry.id, // Include the document ID here
          ...entry.data(),
        };

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
  };

  const onBookingFilterChange = (status) => {
    setOnBookingFilter(status);

    if (status === "cancelled") {
      const filtered = bookings.filter((booking) => booking.iscancelled);
      setFilteredBookings(filtered);
      return;
    }

    const getStatus = (dateArray, endtime, initialStatus) => {
      const now = new Date();

      let activeCount = 0;
      let scheduledCount = 0;
      let pastCount = 0;

      const startDateTime = dateArray.toDate(); // Convert Firebase timestamp to JavaScript Date
      const endDateTime = endtime.toDate(); // Convert Firebase timestamp to JavaScript Date

      if (initialStatus === "cancelled") {
        return;
      }

      if (now >= startDateTime && now <= endDateTime) {
        activeCount++;
      } else if (now < startDateTime) {
        scheduledCount++;
      } else {
        pastCount++;
      }
      const bookingEndTime = endtime.toDate();

      if (initialStatus === "picked" || now > bookingEndTime) {
        return "past";
      }

      if (activeCount > 0) {
        return "active";
      } else if (scheduledCount > 0) {
        return "scheduled";
      } else {
        return "past";
      }
    };

    const filtered = bookings.filter((booking) => {
      const statusFromDates = getStatus(
        booking.starttime,
        booking.endtime,
        booking.status
      );
      return statusFromDates === status || status === "";
    });
    setFilteredBookings(filtered);
  };

  useEffect(() => {
    if (customer.uid) {
      const fetchInitialBookings = async () => {
        try {
          setLoader(true);
          const colRef = collection(db, "bookings");
          const q = query(colRef, where("uid", "==", customer.uid), limit(10));

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
                console.log("User or bag data not found for UID:", booking.uid);
                return booking;
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
      console.log("customer.uid is undefined:", customer.uid);
    }
  }, [customer.uid]);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredBookings(bookings);
    } else {
      const filtered = bookings.filter((booking) =>
        booking.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBookings(filtered);
    }
  }, [searchTerm]);

  // Apply filters whenever bookings data changes
  useEffect(() => {
    if (bookings.length > 0) {
      // onFilterChange(onStatusChange); // Apply the status filter
      onBookingFilterChange(bookingFilter); // Apply the booking filter
    }
  }, [bookings, bookingFilter]);

  const fetchMoreBookings = async () => {
    if (!lastVisible || !customer.uid) return;

    setLoading(true);

    try {
      const colRef = collection(db, "bookings");
      const q = query(
        colRef,
        where("uid", "==", customer.uid),
        startAfter(lastVisible),
        limit(10)
      );

      const moreBookingsSnapshot = await getDocs(q);
      const moreBookingsData = await Promise.all(
        moreBookingsSnapshot.docs.map(async (entry) => {
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
            console.log("User or bag data not found for UID:", booking.uid);
            return booking;
          }
        })
      );

      const newLastVisible =
        moreBookingsSnapshot.docs[moreBookingsSnapshot.docs.length - 1];

      setBookings((prevBookings) => [...prevBookings, ...moreBookingsData]);
      setFilteredBookings((prevBookings) => [
        ...prevBookings,
        ...moreBookingsData,
      ]);
      setLastVisible(newLastVisible);
    } catch (error) {
      console.error("Error fetching more bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loader) return <Loader />;

  return (
    <div className="mt-4 w-full border border-gray-200 rounded-xl p-6 sm:px-4">
      <DetailsTableUpper
        Heading={`${currLang === "en" ? "Bags" : "Pouches"} Ordered`}
        setSearchTerm={setSearchTerm}
        // selectedFilter={onStatusChange}
        // onFilterChange={onFilterChange}
        bookingFilter={bookingFilter}
        onBookingFilterChange={onBookingFilterChange}
      />
      <div className="no-scrollbar w-full overflow-y-hidden">
        <table className="w-full table-auto truncate overflow-hidden rounded-2xl bg-white">
          <thead>
            <tr className="border-b-[1px] border-grayOne border-dashed text-sm font-semibold text-grayOne">
              <th className="pb-[8px] px-[3%] pt-[18px] text-left">
                Deal Name
              </th>
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
                  className="cursor-pointer border-b-[1px] border-[#E4E4E4] border-dashed hover:bg-[#f8f7f7] h-[60px] w-[50px]"
                >
                  <td className="truncate text-left px-[3%]">
                    <div className="flex flex-row items-center gap-x-2">
                      <div className="flex h-[40px] w-[40px] items-center justify-center overflow-hidden rounded-full">
                        <Image
                          src={`/Round-${booking.size}.png`}
                          className="h-full w-full object-cover"
                          width={40}
                          height={40}
                          priority
                        />
                      </div>
                      <div className="flex flex-col gap-y-1">
                        <p className="text-sm font-medium">{booking.name}</p>
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
                      {booking.curr} {booking.price}
                    </p>
                  </td>
                  <td className="truncate text-center px-2">
                    <p className="text-sm font-semibold text-grayThree">
                      {convertTimestampToDDMMYYYY(booking.bookingdate)}
                    </p>
                  </td>
                  <td className="truncate text-center px-2">
                    <StatusDropdown
                      disabled={true}
                      bagDate={booking.bookingdate}
                      cancelled={booking.iscancelled}
                      initialStatus={booking.status}
                      starttime={booking.starttime}
                      endtime={booking.endtime}
                      onStatusChange={(newStatus) =>
                        handleStatusChange(newStatus, booking.id)
                      }
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center py-10 text-grayOne">
                  No Booking found
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

export default CustomerDetailTable;

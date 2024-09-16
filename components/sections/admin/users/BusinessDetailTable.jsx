"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import DetailsTableUpper from "./DetailsTableUpper";
import { users } from "../../../../lib/constant_data";
import LoadMoreButton from "../../../buttons/LoadMoreButton";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { db } from "../../../../app/firebase/config";
import StatusDropdown from "../../bussiness/bookings/StatusDropdown";
import { convertTimestampToDDMMYYYY } from "../../../../utility/date";
import Loader from "../../../loader/loader";

const BusinessDetailTable = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [onStatusChange, setOnStatusChange] = useState("both");
  const [bookingFilter, setOnBookingFilter] = useState("active");
  const [loader, setLoader] = useState(false);

  const router = useRouter();
  const business = useSelector(
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
      where("vendorid", "==", business.uid),
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

    if (status === "cancel") {
      const filtered = bookings.filter((booking) => booking.iscancelled);
      setFilteredBookings(filtered);
      return;
    }

    const getStatus = (dateArray, endtime, initialStatus) => {
      const now = new Date();

      let activeCount = 0;
      let scheduledCount = 0;
      let pastCount = 0;

      dateArray.forEach((dateObj) => {
        const { date, starttime, endtime } = dateObj;
        const startDateTime = starttime.toDate(); // Convert Firebase timestamp to JavaScript Date
        const endDateTime = endtime.toDate(); // Convert Firebase timestamp to JavaScript Date

        if (now >= startDateTime && now <= endDateTime) {
          activeCount++;
        } else if (now < startDateTime) {
          scheduledCount++;
        } else {
          pastCount++;
        }
      });

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
        booking.bag.date,
        booking.endtime,
        booking.status
      );
      return statusFromDates === status || status === "";
    });

    setFilteredBookings(filtered);
  };

  // useEffect(() => {
  //   if (!business || Object.keys(business).length === 0) {
  //     console.log("Business is not defined, redirecting...");
  //     router.push("/admin/users");
  //   }
  // }, [business, router]);

  useEffect(() => {
    if (business.uid) {
      const fetchInitialBookings = async () => {
        try {
          setLoader(true);
          const colRef = collection(db, "bookings");
          const q = query(
            colRef,
            where("vendorid", "==", business.uid),
            limit(10)
          );

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
          // setFilteredBookings(bookingsData);
          setLastVisible(lastDoc);
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
    if (searchTerm === "") {
      setFilteredBookings(bookings);
    } else {
      const filtered = bookings.filter(
        (booking) =>
          booking.user.username
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
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
    // Prevent the function from running if it’s already loading
    if (loading) return;

    try {
      setLoading(true);

      const colRef = collection(db, "bookings");
      let q;

      if (lastVisible) {
        // If lastVisible exists, start after it
        q = query(
          colRef,
          where("vendorid", "==", business.uid),
          startAfter(lastVisible),
          limit(10)
        );
      } else {
        // If lastVisible is null, just order and limit
        q = query(colRef, where("vendorid", "==", business.uid), limit(10));
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

      // Determine the last document for pagination
      const lastDoc =
        allBookingsSnapshot.docs[allBookingsSnapshot.docs.length - 1];

      // Update state with new data
      setBookings((prevBookings) => [...prevBookings, ...bookingsData]);
      // setFilteredBookings((prevBookings) => [...prevBookings, ...bookingsData]);
      setLastVisible(lastDoc); // Set the last visible document for pagination
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
        bookingFilter={bookingFilter}
        onBookingFilterChange={onBookingFilterChange}
        setSearchTerm={setSearchTerm}
      />
      <div className="no-scrollbar w-full  overflow-y-hidden">
        <table
          className="w-full table-auto truncate overflow-hidden rounded-2xl bg-white"
          style={{ boxShadow: "0px 4px 10px 0px rgba(0, 0, 0, 0.10)" }}
        >
          <thead>
            <tr className="border-b-[1px] border-grayOne border-dashed border-opacity-45 text-sm font-semibold text-grayOne">
              <th className="pb-[8px] pt-[18px] pl-[4%] text-left w-[20.00%]">
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
                  <td className="truncate px-[4%] w-[20.00%]">
                    <div className="py-3">
                      <div className="flex flex-row items-center gap-x-2">
                        <div className="flex h-[40px] w-[40px] items-center justify-center overflow-hidden rounded-full">
                          <Image
                            src={booking.user.imageUrl || "/User.png"}
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
                      {convertTimestampToDDMMYYYY(booking.bookingdate)}
                    </p>
                  </td>
                  <td className="truncate text-center px-2">
                    <StatusDropdown
                      disabled={true}
                      bagDate={booking.bag.date}
                      cancelled={booking.iscancelled}
                      initialStatus={booking.status}
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

export default BusinessDetailTable;

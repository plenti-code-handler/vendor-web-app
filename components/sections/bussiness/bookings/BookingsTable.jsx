"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import TableUpper from "./TableUpper";
import { useDispatch } from "react-redux";
import { setActivePage } from "../../../../redux/slices/headerSlice";
import StatusDropdown from "./StatusDropdown";
import LoadMoreButton from "../../../buttons/LoadMoreButton";

const dummyBookings = [
  {
    id: "1",
    customer: "John Doe",
    dealName: "Summer Deal",
    size: "Medium",
    quantity: 2,
    amount: "$500",
    orderDate: "2025-01-25",
    status: "active",
  },
  {
    id: "2",
    customer: "Jane Smith",
    dealName: "Winter Special",
    size: "Large",
    quantity: 1,
    amount: "$750",
    orderDate: "2025-01-22",
    status: "scheduled",
  },
  {
    id: "3",
    customer: "Michael Brown",
    dealName: "Spring Offer",
    size: "Small",
    quantity: 3,
    amount: "$450",
    orderDate: "2025-01-19",
    status: "past",
  },
];

const BookingsTable = () => {
  const dispatch = useDispatch();
  const [bookings, setBookings] = useState(dummyBookings);
  const [filteredBookings, setFilteredBookings] = useState(dummyBookings);
  const [searchTerm, setSearchTerm] = useState("");
  const [bookingFilter, setOnBookingFilter] = useState("active");

  useEffect(() => {
    dispatch(setActivePage("Bookings"));
  }, [dispatch]);

  const onBookingFilterChange = (status) => {
    setOnBookingFilter(status);

    const filtered = dummyBookings.filter((booking) => {
      if (status === "active") return booking.status === "active";
      if (status === "scheduled") return booking.status === "scheduled";
      if (status === "past") return booking.status === "past";
      return true; // Default to all bookings
    });

    setFilteredBookings(filtered);
  };

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredBookings(bookings);
    } else {
      const filtered = bookings.filter(
        (booking) =>
          booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.dealName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBookings(filtered);
    }
  }, [searchTerm, bookings]);

  return (
    <div className="mt-4 w-full border border-gray-200 rounded-xl p-6 sm:px-4">
      <TableUpper
        setSearchTerm={setSearchTerm}
        bookingFilter={bookingFilter}
        onBookingFilterChange={onBookingFilterChange}
      />
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
                  <td className="truncate pl-2 lg:pl-[5%] pr-6 md:pr-2 w-[14.28%]">
                    <div className="py-3">{booking.customer}</div>
                  </td>
                  <td className="pb-[8px] px-2 pt-[18px] text-center">
                    {booking.dealName}
                  </td>
                  <td className="pb-[8px] px-2 pt-[18px] text-center">
                    {booking.size}
                  </td>
                  <td className="pb-[8px] px-2 pt-[18px] text-center">
                    {booking.quantity}
                  </td>
                  <td className="pb-[8px] px-2 pt-[18px] text-center">
                    {booking.amount}
                  </td>
                  <td className="pb-[8px] px-2 pt-[18px] text-center">
                    {booking.orderDate}
                  </td>
                  <td className="pb-[8px] px-2 pt-[18px] text-center">
                    <span
                      className={`px-2 py-1 rounded text-white text-xs font-semibold ${
                        booking.status.toLowerCase() === "active"
                          ? "bg-green-500"
                          : booking.status.toLowerCase() === "past"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <LoadMoreButton onClick={() => console.log("Load more bookings")} />
    </div>
  );
};

export default BookingsTable;

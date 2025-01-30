"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import TableUpper from "./TableUpper";
import Loader from "../../../loader/loader";

const RecentOrders = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loader, setLoader] = useState(false);
  const [countryCode, setCountryCode] = useState("SEK");

  useEffect(() => {
    setLoader(true);
    // Dummy recent orders data
    const dummyBookings = [
      {
        username: "John Doe",
        name: "Deluxe Package",
        size: "Large",
        quantity: 2,
        price: 150,
        bookingdate: "2024-01-10",
        status: "Picked",
      },
      {
        username: "Jane Smith",
        name: "Standard Package",
        size: "Medium",
        quantity: 1,
        price: 80,
        bookingdate: "2024-01-12",
        status: "Cancelled",
      },
      {
        username: "Alex Johnson",
        name: "Economy Package",
        size: "Small",
        quantity: 3,
        price: 50,
        bookingdate: "2024-01-15",
        status: "Pending",
      },
    ];

    setBookings(dummyBookings);
    setFilteredBookings(dummyBookings);
    setLoader(false);
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

  if (loader) {
    return <Loader />;
  }

  return (
    <div className="mt-4 w-full border border-gray-200 rounded-xl p-6 sm:px-4">
      <TableUpper setSearchTerm={setSearchTerm} />
      <div className="no-scrollbar w-full overflow-y-hidden">
        <table className="w-full table-auto bg-white">
          <thead>
            <tr className="border-b text-sm font-semibold text-gray-500">
              <th className="pb-2 pl-5 pt-4 text-left">CUSTOMER</th>
              <th className="pb-2 px-2 pt-4 text-center">Deal Name</th>
              <th className="pb-2 px-2 pt-4 text-center">Size</th>
              <th className="pb-2 px-2 pt-4 text-center">Quantity</th>
              <th className="pb-2 px-2 pt-4 text-center">Amount</th>
              <th className="pb-2 px-2 pt-4 text-center">Order Date</th>
              <th className="pb-2 px-2 pt-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking, index) => (
                <tr key={index} className="border-b hover:bg-gray-100">
                  <td className="pl-5 py-3">{booking.username}</td>
                  <td className="text-center px-2">{booking.name}</td>
                  <td className="text-center px-2">{booking.size}</td>
                  <td className="text-center px-2">{booking.quantity}</td>
                  <td className="text-center px-2">
                    {countryCode} {booking.price}
                  </td>
                  <td className="text-center px-2">{booking.bookingdate}</td>
                  <td className="text-center px-2">
                    <span
                      className={`px-2 py-1 rounded text-white text-xs font-semibold ${
                        booking.status.toLowerCase() === "picked"
                          ? "bg-green-500"
                          : booking.status.toLowerCase() === "cancelled"
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
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No recent orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;

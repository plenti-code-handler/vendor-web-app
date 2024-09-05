"use client";
import React, { useEffect, useState } from "react";
import TableUpper from "./TableUpper";
import BusinessesTable from "../../../sections/admin/users/BusinessesTable";
import CustomersTable from "../../../sections/admin/users/CustomersTable";
import { db } from "../../../../app/firebase/config";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import Loader from "../../../loader/loader";

const TableContainer = () => {
  const [activeTable, setActiveTable] = useState("business");
  const [searchTerm, setSearchTerm] = useState();
  const [businessUsers, setBusinessUsers] = useState([]);
  const [filteredBusinessUsers, setFilteredBusinessUsers] = useState([]);
  const [businessLastVisible, setBusinessLastVisible] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [customerLastVisible, setCustomerLastVisible] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    // Ensure the user and user.uid are available
    const fetchInitialBusinessUsers = async () => {
      try {
        setLoader(true);
        const colRef = collection(db, "users");
        const q = query(
          colRef,
          where("role", "==", "vendor"),
          // orderBy("time"),
          limit(10)
        );

        const allBookingsSnapshot = await getDocs(q);
        const usersData = await Promise.all(
          allBookingsSnapshot.docs.map(async (entry) => {
            const users = entry.data();
            return {
              ...users,
            };
          })
        );
        const lastDoc =
          allBookingsSnapshot.docs[allBookingsSnapshot.docs.length - 1];

        setBusinessUsers(usersData);
        setFilteredBusinessUsers(usersData);
        setBusinessLastVisible(lastDoc);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoader(false);
      }
    };

    fetchInitialBusinessUsers();
  }, []);

  useEffect(() => {
    // Ensure the user and user.uid are available
    const fetchInitialCustomers = async () => {
      try {
        setLoader(true);
        const colRef = collection(db, "users");
        const q = query(colRef, where("role", "==", "customer"), limit(10));

        const allBookingsSnapshot = await getDocs(q);
        const usersData = await Promise.all(
          allBookingsSnapshot.docs.map(async (entry) => {
            const users = entry.data();

            // Fetch bookings where uid = entry.id
            const bookingsRef = collection(db, "bookings");
            const bookingsQuery = query(
              bookingsRef,
              where("uid", "==", entry.id)
            );
            const bookingsSnapshot = await getDocs(bookingsQuery);

            // Calculate total for each booking
            let totalAmount = 0;
            bookingsSnapshot.forEach((bookingDoc) => {
              const bookingData = bookingDoc.data();
              const bookingTotal = bookingData.quantity * bookingData.price;
              totalAmount += bookingTotal;
            });

            // Return user data with the total amount
            return {
              ...users,
              totalAmount, // Add total amount to user data
            };
          })
        );

        const lastDoc =
          allBookingsSnapshot.docs[allBookingsSnapshot.docs.length - 1];

        setCustomers(usersData);
        setFilteredCustomers(usersData);
        setCustomerLastVisible(lastDoc);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoader(false);
      }
    };

    fetchInitialCustomers();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      if (activeTable === "business") {
        setFilteredBusinessUsers(businessUsers);
      } else {
        setFilteredCustomers(customers);
      }
    } else {
      if (activeTable === "business") {
        const filtered = businessUsers.filter((user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredBusinessUsers(filtered);
      } else {
        console.log(customers);
        const filtered = customers.filter((user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCustomers(filtered);
      }
    }
  }, [searchTerm]);

  if (loader) return <Loader />;

  return (
    <div className="mt-4 w-full border border-gray-200 rounded-xl p-6 sm:px-4">
      <TableUpper
        setSearchTerm={setSearchTerm}
        activeTable={activeTable}
        setActiveTable={setActiveTable}
      />
      {activeTable === "business" ? (
        <BusinessesTable
          users={businessUsers}
          setUsers={setBusinessUsers}
          filteredUsers={filteredBusinessUsers}
          setFilteredUsers={setFilteredBusinessUsers}
          lastVisible={businessLastVisible}
          setLastVisible={setBusinessLastVisible}
        />
      ) : (
        <CustomersTable
          users={customers}
          setUsers={setCustomers}
          filteredUsers={filteredCustomers}
          setFilteredUsers={setFilteredCustomers}
          lastVisible={customerLastVisible}
          setLastVisible={setCustomerLastVisible}
        />
      )}
    </div>
  );
};

export default TableContainer;

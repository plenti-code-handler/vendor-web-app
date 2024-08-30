"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { approvalsData } from "../../../../lib/constant_data";
import { redCrossSvg, whiteTickSvg } from "../../../../svgs";
import LoadMoreButton from "../../../buttons/LoadMoreButton";
import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../../app/firebase/config";
import { convertTimestampToDDMMYYYY } from "../../../../utility/date";
import emailjs from "@emailjs/browser";

const ApprovalsTable = () => {
  const [users, setUsers] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);

  useEffect(() => {
    // Ensure the user and user.uid are available
    const fetchInitialUsers = async () => {
      try {
        const colRef = collection(db, "users");
        const q = query(
          colRef,
          where("role", "==", "vendor"),
          where("status", "==", "pending"),
          // orderBy("time"),
          limit(10)
        );

        const allUsersSnapshot = await getDocs(q);
        const usersData = await Promise.all(
          allUsersSnapshot.docs.map(async (entry) => {
            const booking = {
              id: entry.id, // Include the document ID here
              ...entry.data(),
            };

            return {
              ...booking,
            };
          })
        );
        const lastDoc = allUsersSnapshot.docs[allUsersSnapshot.docs.length - 1];

        setUsers(usersData);
        // setFilteredBookings(bookingsData);
        setLastVisible(lastDoc);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchInitialUsers();
  }, []);

  const handleApprove = async (user) => {
    // 1) make request to user and update its status field
    try {
      // Reference to the specific user document
      const userDocRef = doc(db, "users", user.uid);

      // Update the status field
      await updateDoc(userDocRef, {
        status: "accepted",
      });

      console.log(`User ${user.uid} status updated to accepted`);
    } catch (error) {
      console.error("Error updating user status:", error);
    }
    // 2) user emailjs to send an email
    emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_KEY,
      process.env.NEXT_PUBLIC_EMAILJS_APPROVAL_TEMPLATE_KEY,
      {
        message: `We are pleased to inform you that your request has been accepted`,
        approval: "Accepted",
        to_email: user.email,
      },
      { publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY }
    );

    // 3) re fetch the users again
    const colRef = collection(db, "users");
    const q = query(
      colRef,
      where("role", "==", "vendor"),
      where("status", "==", "pending"),
      // orderBy("time"),
      limit(10)
    );

    const allUsersSnapshot = await getDocs(q);
    const usersData = await Promise.all(
      allUsersSnapshot.docs.map(async (entry) => {
        const booking = {
          id: entry.id, // Include the document ID here
          ...entry.data(),
        };

        return {
          ...booking,
        };
      })
    );
    const lastDoc = allUsersSnapshot.docs[allUsersSnapshot.docs.length - 1];

    setUsers(usersData);
  };

  const handleReject = async (user) => {
    // 1) make request to user and update its status field
    try {
      // Reference to the specific user document
      const userDocRef = doc(db, "users", user.uid);

      // Update the status field
      await updateDoc(userDocRef, {
        status: "rejected",
      });

      console.log(`User ${user.uid} status updated to approved`);
    } catch (error) {
      console.error("Error updating user status:", error);
    }
    // 2) user emailjs to send an email
    emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_KEY,
      process.env.NEXT_PUBLIC_EMAILJS_APPROVAL_TEMPLATE_KEY,
      {
        message: `We are pleased to inform you that your request has been accepted`,
        approval: "Rejected",
        to_email: user.email,
      },
      { publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY }
    );

    // 3) re fetch the users again
    const colRef = collection(db, "users");
    const q = query(
      colRef,
      where("role", "==", "vendor"),
      where("status", "==", "pending"),
      // orderBy("time"),
      limit(10)
    );

    const allUsersSnapshot = await getDocs(q);
    const usersData = await Promise.all(
      allUsersSnapshot.docs.map(async (entry) => {
        const booking = {
          id: entry.id, // Include the document ID here
          ...entry.data(),
        };

        return {
          ...booking,
        };
      })
    );
    const lastDoc = allUsersSnapshot.docs[allUsersSnapshot.docs.length - 1];

    setUsers(usersData);
  };

  return (
    <div className="no-scrollbar w-full overflow-y-hidden lg:pl-10 lg:pr-10">
      <table className="w-full table-auto truncate overflow-hidden rounded-2xl bg-white">
        <thead>
          <tr className="border-b-[1px] border-grayOne border-dashed border-opacity-20 text-sm font-semibold text-grayOne">
            <th className="pb-[8px] pl-2 pt-[18px] text-left w-[18.00%]">
              Business Name
            </th>
            <th className="pb-[8px] px-12 pt-[18px] text-left w-[20.00%]">
              Address
            </th>
            <th className="pb-[8px] px-2 pt-[18px] text-left w-[30.00%]">
              Description
            </th>
            <th className="pb-[8px] px-2 pt-[18px] text-center">
              Submitted at
            </th>
            <th className="pb-[8px] px-2 pt-[18px] text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr
              key={index}
              className="cursor-pointer border-b-[1px] border-[#E4E4E4] hover:bg-[#f8f7f7] border-dashed"
            >
              <td className="truncate pl-2 pr-2 w-[18.00%]">
                <div className="py-3">
                  <div className="flex flex-row items-center gap-x-4">
                    <div className="flex h-[40px] w-[40px] items-center justify-center overflow-hidden rounded-full">
                      <Image
                        src={user.imageUrl || "/User.png"}
                        alt="GetSpouse Logo"
                        className="h-full w-full object-cover"
                        width={40}
                        height={40}
                        priority
                      />
                    </div>
                    <div className="flex flex-col gap-y-1">
                      <p className="text-sm font-medium">{user.name}</p>
                    </div>
                  </div>
                </div>
              </td>
              <td className="truncate text-center px-2 w-[18.00%]">
                <p className="text-sm font-semibold text-grayThree">
                  {user.loc}
                </p>
              </td>
              <td className="relative text-left px-2 w-[15.00%]">
                <p
                  className="text-sm font-semibold text-grayThree truncate overflow-hidden whitespace-nowrap tooltip-target"
                  style={{ maxWidth: "280px" }}
                >
                  {user.desc}
                </p>
              </td>
              <td className="truncate text-center px-2">
                <p className="text-sm font-semibold text-grayThree">
                  {convertTimestampToDDMMYYYY(user.joinedat)}
                </p>
              </td>
              <td className="truncate text-center ">
                <div className="flex flex-row justify-center gap-2">
                  <button
                    onClick={() => handleReject(user)}
                    className="rounded-md bg-white border border-redOne p-3 hover:bg-red-50"
                  >
                    {redCrossSvg}
                  </button>
                  <button
                    onClick={() => handleApprove(user)}
                    className="rounded-md bg-secondary p-2 hover:bg-main"
                  >
                    {whiteTickSvg}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <LoadMoreButton />
    </div>
  );
};

export default ApprovalsTable;

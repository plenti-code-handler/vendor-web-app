"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { adminCustomers } from "../../../../lib/constant_data";
import { useRouter } from "next/navigation";
import LoadMoreButton from "../../../buttons/LoadMoreButton";
import {
  collection,
  getDocs,
  limit,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { db } from "../../../../app/firebase/config";
import { useDispatch } from "react-redux";
import { selectBusiness } from "../../../../redux/slices/selectedBusinessSlice";
import { convertTimestampToDDMMYYYY } from "../../../../utility/date";

const CustomersTable = ({
  users,
  setUsers,
  filteredUsers,
  setFilteredUsers,
  lastVisible,
  setLastVisible,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleRowClick = (user) => {
    const { uid } = user;
    dispatch(selectBusiness(user));
    router.replace(`/admin/users/customer/${uid}`);
  };

  // const [users, setUsers] = useState([]);
  // const [filteredUsers, setFilteredUsers] = useState([]);
  // const [searchTerm, setSearchTerm] = useState("");
  // const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMoreUsers = async () => {
    if (!lastVisible) return; // Prevent fetching more if there's no last visible document

    setLoading(true); // Set loading state to true while fetching more users

    try {
      const colRef = collection(db, "users");
      const q = query(
        colRef,
        where("role", "==", "customer"),
        startAfter(lastVisible), // Start after the last document fetched
        limit(10)
      );

      const moreUsersSnapshot = await getDocs(q);
      const moreUsersData = moreUsersSnapshot.docs.map((doc) => doc.data());
      const newLastVisible =
        moreUsersSnapshot.docs[moreUsersSnapshot.docs.length - 1];

      setUsers((prevUsers) => [...prevUsers, ...moreUsersData]); // Append new users to the existing list
      setFilteredUsers((prevUsers) => [...prevUsers, ...moreUsersData]); // Update filtered users as well
      setLastVisible(newLastVisible); // Update the last visible document
    } catch (error) {
      console.error("Error fetching more users:", error);
    } finally {
      setLoading(false); // Set loading state to false once fetching is complete
    }
  };

  return (
    <div className="no-scrollbar w-full overflow-y-hidden lg:pl-10 lg:pr-10">
      <table className="w-full table-auto truncate overflow-hidden rounded-2xl bg-white">
        <thead>
          <tr className="border-b-[1px]  border-grayOne border-dashed border-opacity-45 text-[16px] font-semibold text-grayOne">
            <th className="pb-[8px] pl-2 pt-[18px] text-left w-[18.00%]">
              Customer
            </th>
            <th className="pb-[8px] px-[14%] pt-[18px] text-left">Email</th>
            <th className="pb-[8px] px-2 pt-[18px] text-left w-[20.00%]">
              Total Spending
            </th>
            <th className="pb-[8px] px-2 pt-[18px] text-center w-[20.00%]">
              Joined at
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers > 0 ? (
            filteredUsers.map((user, index) => (
              <tr
                key={index}
                className="cursor-pointer border-b-[1px] border-[#E4E4E4] border-dashed hover:bg-[#f8f7f7]"
                onClick={() => handleRowClick(user)}
              >
                <td className="truncate pl-2 pr-2 w-[18.00%]">
                  <div className="py-3">
                    <div className="flex flex-row items-center gap-x-2">
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
                        <p className="text-sm font-medium">{user.username}</p>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="truncate text-center px-2">
                  <p className="text-sm font-semibold text-grayThree">
                    {user.email}
                  </p>
                </td>
                <td className="relative text-left px-8">
                  <p className="text-sm font-semibold text-grayThree truncate overflow-hidden whitespace-nowrap tooltip-target">
                    € {user.totalSpending}
                  </p>
                </td>
                <td className="truncate text-center px-2">
                  <p className="text-sm font-semibold text-grayThree">
                    {convertTimestampToDDMMYYYY(user.joinedat)}
                  </p>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" className="text-center py-10 text-grayOne">
                No Customers Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <LoadMoreButton loadMore={fetchMoreUsers} isLoading={loading} />
    </div>
  );
};

export default CustomersTable;

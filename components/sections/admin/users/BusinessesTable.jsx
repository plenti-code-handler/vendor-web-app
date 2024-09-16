"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { adminBusinesses } from "../../../../lib/constant_data";
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

const BusinessesTable = ({
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
    router.replace(`/admin/users/business/${uid}`);
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
        where("role", "==", "vendor"),
        startAfter(lastVisible), // Start after the last document fetched
        limit(10)
      );

      const moreBookingsSnapshot = await getDocs(q);
      const moreUsersData = moreBookingsSnapshot.docs.map((doc) => doc.data());
      const newLastVisible =
        moreBookingsSnapshot.docs[moreBookingsSnapshot.docs.length - 1];

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
    <div className="no-scrollbar w-full overflow-y-hidden lg:pl-10 lg:pr-10 ">
      <table className="w-full table-auto truncate overflow-hidden rounded-2xl bg-white">
        <thead>
          <tr className="border-b-[1px]  border-grayOne border-dashed border-opacity-45 text-[16px] font-semibold text-grayOne">
            <th className="pb-[8px] pl-2 pt-[18px] text-left">Business Name</th>
            <th className="pb-[8px] pt-[18px] text-left">Address</th>
            <th className="pb-[8px] pt-[18px] text-left">Description</th>
            <th className="pb-[8px] pt-[18px] text-left">Joined at</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <tr
                key={index}
                className="cursor-pointer border-b-[1px] border-[#E4E4E4] border-dashed hover:bg-[#f8f7f7]"
                onClick={() => handleRowClick(user)}
              >
                <td className="truncate pl-2 pr-6   md:pr-2">
                  <div className="py-3">
                    <div className="flex flex-row items-center gap-x-2">
                      <div className="flex h-[40px] w-[40px] items-center justify-center overflow-hidden rounded-full">
                        <Image
                          src={user.imageUrl || "/User.png"}
                          className="h-full w-full object-cover"
                          width={40}
                          height={40}
                          priority
                        />
                      </div>
                      <div className="flex flex-col gap-y-1">
                        <p className="text-sm font-medium   truncate overflow-hidden whitespace-nowrap tooltip-target">
                          {user.name.length > 10
                            ? `${user.name.slice(0, 10)}...`
                            : user.name}
                        </p>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="truncate text-left px-2">
                  <p className="text-sm font-semibold text-grayThree truncate overflow-hidden whitespace-nowrap tooltip-target">
                    {user.loc.length > 40
                      ? `${user.loc.slice(0, 40)}...`
                      : user.loc}
                  </p>
                </td>
                <td className="relative text-left px-2">
                  <p className="text-sm font-semibold text-grayThree truncate overflow-hidden whitespace-nowrap tooltip-target">
                    {user.desc.length > 60
                      ? `${user.desc.slice(0, 60)}...`
                      : user.desc}
                  </p>
                </td>

                <td className="truncate text-left px-2">
                  <p className="text-sm font-semibold text-grayThree">
                    {convertTimestampToDDMMYYYY(user.joinedat)}
                  </p>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" className="text-center py-10 text-grayOne">
                No Businesses found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <LoadMoreButton loadMore={fetchMoreUsers} isLoading={loading} />
    </div>
  );
};

export default BusinessesTable;

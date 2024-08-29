"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { adminBusinesses } from "../../../../lib/constant_data";
import { useRouter } from "next/navigation";
import LoadMoreButton from "../../../buttons/LoadMoreButton";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "../../../../app/firebase/config";
import { useDispatch } from "react-redux";
import { selectBusiness } from "../../../../redux/slices/selectedBusinessSlice";

const BusinessesTable = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleRowClick = (user) => {
    const { uid } = user;
    dispatch(selectBusiness(user));
    router.replace(`/admin/users/business/${uid}`);
  };

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  // const [searchTerm, setSearchTerm] = useState("");
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Ensure the user and user.uid are available
    const fetchInitialUsers = async () => {
      try {
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

        setUsers(usersData);
        setFilteredUsers(usersData);
        setLastVisible(lastDoc);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchInitialUsers();
  }, []);

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
          {filteredUsers.map((user, index) => (
            <tr
              key={index}
              className="cursor-pointer border-b-[1px] border-[#E4E4E4] border-dashed hover:bg-[#f8f7f7]"
              onClick={() => handleRowClick(user)}
            >
              <td className="truncate pl-2 pr-2">
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
                      <p className="text-sm font-medium">{user.name}</p>
                    </div>
                  </div>
                </div>
              </td>
              <td className="truncate text-left px-2">
                <p className="text-sm font-semibold text-grayThree">
                  {user.loc}
                </p>
              </td>
              <td className="relative text-left px-2">
                <p className="text-sm font-semibold text-grayThree truncate overflow-hidden whitespace-nowrap tooltip-target">
                  {user.desc}
                </p>
              </td>
              <td className="truncate text-left px-2">
                <p className="text-sm font-semibold text-grayThree">
                  {/* {user.joinedAt} */}
                </p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <LoadMoreButton />
    </div>
  );
};

export default BusinessesTable;

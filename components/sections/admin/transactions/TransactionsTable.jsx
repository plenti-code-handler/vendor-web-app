"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { transactionsData } from "../../../../lib/constant_data";
import LoadMoreButton from "../../../buttons/LoadMoreButton";
import TableUpper from "./TableUpper";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../../app/firebase/config";
import { redCrossSvg, whiteTickSvg } from "../../../../svgs";
import Loader from "../../../loader/loader";

const TransactionsTable = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [filteredWithdrawals, setFilteredWithdrawals] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    // Ensure the user and user.uid are available
    const fetchInitialWithdrawals = async () => {
      try {
        setLoader(true);
        const colRef = collection(db, "withdrawals");
        const q = query(colRef, where("status", "==", "pending"), limit(10));

        const allWithdrawalsSnapshot = await getDocs(q);
        const withdrawalsData = await Promise.all(
          allWithdrawalsSnapshot.docs.map(async (entry) => {
            const withdrawal = entry.data();
            const id = entry.id;

            // Fetch user data based on the user ID in the withdrawal
            const userDocRef = doc(db, "users", withdrawal.vendorId); // Assuming withdrawal.uid is the field for user ID
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
              const userData = userDocSnap.data();
              return {
                id,
                ...withdrawal,
                user: userData, // Merge user data with booking
              };
            } else {
              console.log("User data not found for UID:", withdrawal.uid);
              return withdrawal; // Return booking without user data if not found
            }
          })
        );
        const lastDoc =
          allWithdrawalsSnapshot.docs[allWithdrawalsSnapshot.docs.length - 1];

        setWithdrawals(withdrawalsData);
        setFilteredWithdrawals(withdrawalsData);
        setLastVisible(lastDoc);
      } catch (error) {
        console.error("Error fetching withdrawals:", error);
      } finally {
        setLoader(false);
      }
    };

    fetchInitialWithdrawals();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredWithdrawals(withdrawals);
    } else {
      const filtered = withdrawals.filter((withdrawal) =>
        withdrawal.user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredWithdrawals(filtered);
    }
  }, [searchTerm]);

  const handleReject = async (withdrawal) => {
    // Reference to the withdrawal document
    const withdrawalRef = doc(db, "withdrawals", withdrawal.id);

    // Reference to the user document
    const userRef = doc(db, "users", withdrawal.vendorId);

    try {
      // Update the withdrawal status to "not paid"
      await updateDoc(withdrawalRef, {
        status: "not paid",
      });

      // Fetch the user document to get the current revenue
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const currentRevenue = userData.revenue || 0;

        // Add the withdrawal amount to the user's revenue
        await updateDoc(userRef, {
          revenue: currentRevenue + withdrawal.amount,
        });

        console.log("Withdrawal rejected and user revenue updated.");
      } else {
        console.log("User not found.");
      }
    } catch (error) {
      console.error("Error updating withdrawal status or user revenue:", error);
    }
  };

  const handleApprove = async (withdrawal) => {
    try {
      const withdrawalRef = doc(db, "withdrawals", withdrawal.id);

      await updateDoc(withdrawalRef, {
        status: "paid",
      });
      console.log("Withdrawal approved and status updated to paid.");
    } catch (error) {
      console.error("Error updating withdrawal status:", error);
    }
  };

  if (loader) return <Loader />;

  return (
    <div className="flex flex-col w-[100%] lg:w-[100%] mt-4 border border-[#E3E3E3] rounded-2xl p-6 lg:p-3 sm:px-4">
      <div className="no-scrollbar w-full overflow-y-hidden lg:pl-10 lg:pr-10">
        <TableUpper setSearchTerm={setSearchTerm} />

        <div className="overflow-x-auto">
          <table className="w-full min-w-max table-auto truncate rounded-2xl bg-white">
            <thead>
              <tr className="border-b-[1px] border-grayOne border-dashed border-opacity-20 text-sm font-semibold text-grayOne">
                <th className="pb-[8px] pl-2 pt-[18px] text-left ">Business</th>
                <th className="pb-[8px] pt-[18px] text-center">
                  Amount Requested
                </th>
                <th className="pb-[8px] px-2 pt-[18px] text-center ">
                  Account Holder Name
                </th>
                <th className="pb-[8px] px-2 pt-[18px] text-center ">
                  Account Number
                </th>
                <th className="pb-[8px] px-2 pt-[18px] text-center">
                  Requested At
                </th>
                <th className="pb-[8px] px-2 pt-[18px] text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredWithdrawals.length > 0 ? (
                filteredWithdrawals.map((withdrawal) => (
                  <tr key={withdrawal.id}>
                    <td className="py-2 px-4 text-left">
                      <div className="py-3">
                        <div className="flex flex-row items-center gap-x-4">
                          <div className="flex h-[40px] w-[40px] items-center justify-center overflow-hidden rounded-full">
                            <Image
                              src={withdrawal.user.imageUrl || "/User.png"}
                              alt="GetSpouse Logo"
                              className="h-full w-full object-cover"
                              width={40}
                              height={40}
                              priority
                            />
                          </div>
                          <div className="flex flex-col gap-y-1">
                            <p className="text-sm font-medium">
                              {withdrawal.user.name}
                            </p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="truncate text-center px-2">
                      <p className="text-sm font-semibold text-grayThree">
                        € {withdrawal.amount}
                      </p>
                    </td>
                    <td className="truncate text-center px-2">
                      <p className="text-sm font-semibold text-grayThree">
                        {withdrawal.accountHolder}
                      </p>
                    </td>
                    <td className="truncate text-center px-2">
                      <p className="text-sm font-semibold text-grayThree">
                        {withdrawal.iban}
                      </p>
                    </td>
                    <td className="truncate text-center px-2">
                      <p className="text-sm font-semibold text-grayThree">
                        {new Intl.DateTimeFormat("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        }).format(
                          new Date(withdrawal.createdAt.seconds * 1000)
                        )}
                      </p>
                    </td>
                    <td className="truncate text-center px-2">
                      <p className="text-sm font-semibold text-grayThree">
                        {withdrawal.status === "pending" && (
                          <div className="flex flex-row justify-center gap-2">
                            <button
                              onClick={() => handleReject(withdrawal)}
                              className="rounded-md bg-white border border-redOne p-3 hover:bg-red-50"
                            >
                              {redCrossSvg}
                            </button>
                            <button
                              onClick={() => handleApprove(withdrawal)}
                              className="rounded-md bg-secondary p-2 hover:bg-main"
                            >
                              {whiteTickSvg}
                            </button>
                          </div>
                        )}
                      </p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center py-10 text-grayOne">
                    No Pending Transactions
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  {
    /*
    <div className="no-scrollbar w-full lg:pl-10 lg:pr-10">
      <TableUpper />

      <table className="w-full table-auto truncate overflow-hidden rounded-2xl bg-white">
        <thead>
          <tr className="border-b-[1px] border-grayOne border-dashed border-opacity-20 text-sm font-semibold text-grayOne">
            <th className="pb-[8px] pl-2 pt-[18px] text-left w-[18.00%]">
              Business
            </th>
            <th className="pb-[8px] px-12 pt-[18px] text-left w-[20.00%]">
              Amount Requested
            </th>
            <th className="pb-[8px] px-2 pt-[18px] text-center w-[30.00%]">
              Account Number
            </th>
            <th className="pb-[8px] px-2 pt-[18px] text-center w-[30.00%]">
              Requested At
            </th>
          </tr>
        </thead>
        <tbody>
           {transactionsData.map((user, index) => (
            <tr
              key={index}
              className="cursor-pointer border-b-[1px] border-[#E4E4E4] hover:bg-[#f8f7f7] border-dashed"
            >
              <td className="truncate pl-2 pr-2 w-[18.00%]">
                <div className="py-3">
                  <div className="flex flex-row items-center gap-x-4">
                    <div className="flex h-[40px] w-[40px] items-center justify-center overflow-hidden rounded-full">
                      <Image
                        src="/User.png"
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
                  {user.totalBagsSol}
                </p>
              </td>
              <td className="truncate text-center px-2 w-[18.00%]">
                <p className="text-sm font-semibold text-grayThree">
                  € {user.amountGenerated}
                </p>
              </td>
              <td className="truncate text-center px-2">
                <p className="text-sm font-semibold text-grayThree">
                  € {user.ourCommisionPercent}
                </p>
              </td>
            </tr>
          ))} 
         </tbody>
       </table>
       <LoadMoreButton />
     </div>
    */
  }
};

export default TransactionsTable;

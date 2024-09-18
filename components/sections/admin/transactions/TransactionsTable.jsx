"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { transactionsData } from "../../../../lib/constant_data";
import LoadMoreButton from "../../../buttons/LoadMoreButton";
import TableUpper from "./TableUpper";
import { getAuth } from "firebase/auth";
import emailjs from "@emailjs/browser";

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
import { toast } from "sonner";

const TransactionsTable = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [filteredWithdrawals, setFilteredWithdrawals] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loader, setLoader] = useState(false);
  const [loadingApproveId, setLoadingApproveId] = useState(null);
  const [loadingRejectId, setLoadingRejectId] = useState(null);

  useEffect(() => {
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

            // Fetch user data
            const userDocRef = doc(db, "users", withdrawal.vendorId);
            const userDocSnap = await getDoc(userDocRef);

            // If user exists, return the withdrawal with user data
            if (userDocSnap.exists()) {
              const userData = userDocSnap.data();
              return {
                id,
                ...withdrawal,
                user: userData,
              };
            } else {
              // Log and return null for non-existent users
              console.log("User data not found for UID:", withdrawal.vendorId);
              return null; // This ensures invalid entries are skipped
            }
          })
        );

        const validWithdrawals = withdrawalsData.filter(
          (withdrawal) => withdrawal !== null
        );

        const lastDoc =
          allWithdrawalsSnapshot.docs[allWithdrawalsSnapshot.docs.length - 1];

        setWithdrawals(validWithdrawals);
        setFilteredWithdrawals(validWithdrawals);
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
    setLoadingRejectId(withdrawal.id);

    const withdrawalRef = doc(db, "withdrawals", withdrawal.id);

    const userRef = doc(db, "users", withdrawal.vendorId);

    try {
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const currentRevenue = parseFloat(userData.revenue) || 0;

        const formattedDate = withdrawal.createdAt.toDate();

        const options = { day: "numeric", month: "short", year: "2-digit" };
        const formattedDateString = formattedDate.toLocaleDateString(
          "en-GB",
          options
        );
        const formattedTimeString = formattedDate.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
        const finalFormattedString = `${formattedDateString}, ${formattedTimeString}`;

        emailjs.send(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_KEY,
          process.env.NEXT_PUBLIC_EMAILJS_TRANSACTION_REQUEST_TEMPLATE_KEY,
          {
            approval: "Rejected",
            message: `We hope this message finds you well. Unfortunately, your recent withdrawal request has been rejected. We understand this may be disappointing, and we encourage you to review the following details of your transaction:`,
            Amount: withdrawal.amount,
            Date: finalFormattedString,
            IBAN: withdrawal.iban,
            message2:
              "If you believe this decision has been made in error or if you have any further questions, please do not hesitate to contact us for clarification.",
            to_email: userData.email,
            reply_to: "kontakt@foodiefinder.se",
          },
          { publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY }
        );

        await updateDoc(withdrawalRef, {
          status: "not paid",
        });

        await updateDoc(userRef, {
          revenue: (currentRevenue + Number(withdrawal.amount)).toFixed(2),
        });

        toast.success("Withdrawal rejected.");

        console.log("Withdrawal rejected and user revenue updated.");
      } else {
        console.log("User not found.");
      }
    } catch (error) {
      console.error("Error updating withdrawal status or user revenue:", error);
    }
    try {
      setLoader(true);
      const colRef = collection(db, "withdrawals");
      const q = query(colRef, where("status", "==", "pending"), limit(10));

      const allWithdrawalsSnapshot = await getDocs(q);
      const withdrawalsData = await Promise.all(
        allWithdrawalsSnapshot.docs.map(async (entry) => {
          const withdrawal = entry.data();
          const id = entry.id;

          const userDocRef = doc(db, "users", withdrawal.vendorId);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            return {
              id,
              ...withdrawal,
              user: userData,
            };
          } else {
            console.log("User data not found for UID:", withdrawal.uid);
            return withdrawal;
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
      setLoadingRejectId(null);
    }
    setLoadingRejectId(null);
  };

  const handleApprove = async (withdrawal) => {
    try {
      setLoadingApproveId(withdrawal.id);

      const formattedDate = withdrawal.createdAt.toDate();

      const options = { day: "numeric", month: "short", year: "2-digit" };
      const formattedDateString = formattedDate.toLocaleDateString(
        "en-GB",
        options
      );
      const formattedTimeString = formattedDate.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      const finalFormattedString = `${formattedDateString}, ${formattedTimeString}`;

      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
          toast.error("User is not authenticated.");
          return;
        }

        const userRef = doc(db, "users", withdrawal.vendorId);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
          toast.error("User data not found in Firestore.");

          return;
        }
        const { email } = userDoc.data();

        console.log(
          email,
          withdrawal.amount,
          finalFormattedString,
          withdrawal.iban
        );

        emailjs.send(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_KEY,
          process.env.NEXT_PUBLIC_EMAILJS_TRANSACTION_REQUEST_TEMPLATE_KEY,
          {
            approval: "Accepted",
            message: `We are pleased to inform you that your recent transaction has been approved. Please find the details of the transaction below:`,
            Amount: withdrawal.amount,
            Date: finalFormattedString,
            IBAN: withdrawal.iban,
            message2:
              "The approved payment will be processed and deposited into the provided IBAN account. If you have any further questions or need assistance, feel free to contact us.",
            to_email: email,
            reply_to: "kontakt@foodiefinder.se",
          },
          { publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY }
        );
        const withdrawalRef = doc(db, "withdrawals", withdrawal.id);
        await updateDoc(withdrawalRef, {
          status: "paid",
        });

        toast.success("Withdrawal approved successfully.");
      } catch (error) {
        console.error("Error updating withdrawal status:", error);
      }

      try {
        setLoader(true);
        const colRef = collection(db, "withdrawals");
        const q = query(colRef, where("status", "==", "pending"), limit(10));

        const allWithdrawalsSnapshot = await getDocs(q);
        const withdrawalsData = await Promise.all(
          allWithdrawalsSnapshot.docs.map(async (entry) => {
            const withdrawal = entry.data();
            const id = entry.id;

            const userDocRef = doc(db, "users", withdrawal.vendorId);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
              const userData = userDocSnap.data();
              return {
                id,
                ...withdrawal,
                user: userData,
              };
            } else {
              console.log("User data not found for UID:", withdrawal.uid);
              return withdrawal;
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
    } catch (error) {
      console.error("Error ", error);
    } finally {
      setLoadingApproveId(null);
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
                      {withdrawal.status === "pending" && (
                        <div className="flex flex-row justify-center gap-2">
                          <button
                            onClick={() => handleReject(withdrawal)}
                            className={`w-[40px] h-[40px] rounded-md bg-white border border-redOne p-3 hover:bg-red-50 flex items-center justify-center`}
                            disabled={loadingRejectId === withdrawal.id}
                          >
                            {loadingRejectId === withdrawal.id ? (
                              <div className="loader">
                                {" "}
                                {/* Loader element */}
                                <svg
                                  className="animate-spin h-5 w-5 text-white"
                                  width="22"
                                  height="22"
                                  viewBox="0 0 22 22"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M11 2.75C9.36831 2.75 7.77325 3.23385 6.41655 4.14038C5.05984 5.0469 4.00242 6.33537 3.378 7.84286C2.75357 9.35035 2.5902 11.0092 2.90853 12.6095C3.22685 14.2098 4.01259 15.6798 5.16637 16.8336C6.32016 17.9874 7.79017 18.7732 9.39051 19.0915C10.9909 19.4098 12.6497 19.2464 14.1571 18.622C15.6646 17.9976 16.9531 16.9402 17.8596 15.5835C18.7662 14.2267 19.25 12.6317 19.25 11"
                                    stroke="#F1416C"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </div>
                            ) : (
                              redCrossSvg
                            )}
                          </button>
                          <button
                            onClick={() => handleApprove(withdrawal)}
                            className={`w-[40px] h-[40px] rounded-md bg-secondary p-2 hover:bg-main flex items-center justify-center`}
                            disabled={loadingApproveId === withdrawal.id}
                          >
                            {loadingApproveId === withdrawal.id ? (
                              <div className="loader">
                                {" "}
                                {/* Loader element */}
                                <svg
                                  className="animate-spin h-5 w-5 text-white"
                                  width="22"
                                  height="22"
                                  viewBox="0 0 22 22"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M11 2.75C9.36831 2.75 7.77325 3.23385 6.41655 4.14038C5.05984 5.0469 4.00242 6.33537 3.378 7.84286C2.75357 9.35035 2.5902 11.0092 2.90853 12.6095C3.22685 14.2098 4.01259 15.6798 5.16637 16.8336C6.32016 17.9874 7.79017 18.7732 9.39051 19.0915C10.9909 19.4098 12.6497 19.2464 14.1571 18.622C15.6646 17.9976 16.9531 16.9402 17.8596 15.5835C18.7662 14.2267 19.25 12.6317 19.25 11"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </div>
                            ) : (
                              whiteTickSvg
                            )}
                          </button>
                        </div>
                      )}
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

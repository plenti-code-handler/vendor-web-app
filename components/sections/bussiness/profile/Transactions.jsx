"use client";

import React, { useContext, useEffect, useState } from "react";
import {
  bottomWalletBackground,
  leftWalletBackground,
  payPalSvg,
  rightWalletBackground,
  topLeftWalletBackground,
  withdrawAmountSvg,
} from "../../../../svgs";
import { useDispatch } from "react-redux";
import { setOpenDrawer } from "../../../../redux/slices/withdrawAmountSlice";
import { setActivePage } from "../../../../redux/slices/headerSlice";
import WithdrawAmountDrawer from "../../../drawers/WithdrawAmountDrawer";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../../app/firebase/config";
import Loader from "../../../loader/loader";
import { RevenueContext } from "../../../../contexts/RevenueContext";

const Transactions = () => {
  const { balance, setBalance, withdrawals, setWithdrawals } =
    useContext(RevenueContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [withdrawals, setWithdrawals] = useState([]);
  const [loader, setLoader] = useState(false);
  const auth = getAuth();
  const dispatch = useDispatch();
  const handleWithdraw = () => {
    dispatch(setOpenDrawer(true));
  };
  // const [revenue, setRevenue] = useState(null);

  useEffect(() => {
    dispatch(setActivePage(""));
  }, [dispatch]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const fetchWithdrawals = async (user) => {
      try {
        setLoader(true);
        const vendorId = user.uid;

        // Create a query to get withdrawals where vendorId matches the current user's ID
        const q = query(
          collection(db, "withdrawals"),
          where("vendorId", "==", vendorId)
        );

        // Execute the query
        const querySnapshot = await getDocs(q);

        // Map through the querySnapshot and collect all withdrawal data
        const withdrawalsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log(withdrawalsData);

        // Update state with the fetched data
        setWithdrawals(withdrawalsData);
      } catch (error) {
        console.error("Error fetching withdrawals: ", error);
      } finally {
        setLoader(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchWithdrawals(user); // Fetch withdrawals when user is authenticated
      } else {
        setWithdrawals([]); // Clear withdrawals if the user is not logged in
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const fetchUserRevenue = async () => {
      try {
        const user = auth.currentUser;

        if (!user) {
          console.error("No user is logged in");
          return;
        }

        // Fetch the user document from Firestore
        const userDocRef = doc(db, "users", user.uid); // Assuming 'users' is your collection name
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          // setRevenue(data.revenue); // Adjust if your field name is different
          setBalance(data.revenue); // Adjust if your field name is different
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error(`Error fetching data: ${error.message}`);
      }
    };

    fetchUserRevenue();
  }, [auth.currentUser]);

  return (
    <div className="flex flex-col w-[100%] lg:w-[50%] md:w-[60%] p-5 md:p-0">
      {isAuthenticated && (
        <WithdrawAmountDrawer
          balance={balance}
          setBalance={setBalance}
          withdrawals={withdrawals}
          setWithdrawals={setWithdrawals}
        />
      )}
      <div
        className="flex flex-col justify-center bg-gradient-custom rounded-xl items-center shadow-lg p-6"
        style={{ width: "100%", height: "255px", position: "relative" }}
      >
        <div className="absolute bottom-[0%] left-[40%] -z-0">
          {bottomWalletBackground}
        </div>
        <div className="absolute left-[0px] -z-0">{leftWalletBackground}</div>
        <div className="absolute top-[0%] right-[5%] -z-0">
          {rightWalletBackground}
        </div>
        <div className="absolute top-[0%] left-[15%] -z-0">
          {topLeftWalletBackground}
        </div>
        <p className="text-[40px] font-bold text-white z-0">
          {JSON.parse(localStorage.getItem("countryCode"))}{" "}
          {Number(balance).toFixed(2)}
        </p>
        <p className="text-[16px] font-medium text-white z-0">My Wallet</p>

        <button
          onClick={() => handleWithdraw()}
          className="flex justify-center items-center bg-black/5 text-white font-medium rounded hover:bg-main p-2 mt-4 z-0"
        >
          {withdrawAmountSvg}
          <span className="ml-2">Withdraw Amount</span>
        </button>
      </div>
      {loader ? (
        <Loader />
      ) : (
        <div className="flex flex-col mt-4 p-3">
          <p className="font-semibold text-[24px] text-blackTwo mb-2">
            Transaction History
          </p>
          {withdrawals.length > 0 ? (
            withdrawals.map((withdrawal) => {
              const decideStyle = (status) => {
                switch (status) {
                  case "paid":
                    return "bg-green-200 border-green-500 text-green-500";
                  case "not paid":
                    return "bg-red-200 text-red-500 border-red-500";
                  case "pending":
                    return "bg-scheduledBg border-badgeScheduled text-badgeScheduled";
                  default:
                    return "";
                }
              };
              return (
                <>
                  <div
                    key={withdrawal.id}
                    className="flex justify-between px-6 py-4 items-center bg-white shadow-lg transform translate-y-[-5px] p-2 rounded-lg mt-2 w-full"
                  >
                    <div className="flex gap-2">
                      {/* <span className="mt-2">{payPalSvg}</span> */}
                      <div className="flex flex-col">
                        <p className="text-cardNumber text-[16px] font-semibold">
                          #{withdrawal.withdrawalno}
                        </p>
                        <p className="text-date text-[14px] font-medium">
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
                      </div>
                    </div>
                    <div className="flex gap-5 items-center">
                      <div
                        className={`${decideStyle(
                          withdrawal.status
                        )} font-semibold rounded-full text-center border text-[12px] px-5 py-1`}
                      >
                        {withdrawal.status === "paid"
                          ? "Accepted"
                          : withdrawal.status === "not paid"
                          ? "Rejected"
                          : withdrawal.status === "pending"
                          ? "Pending"
                          : ""}
                      </div>
                      <div className="text-amount text-[20px] font-semibold">
                        {JSON.parse(localStorage.getItem("countryCode"))}
                        {Number(withdrawal.amount).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </>
              );
            })
          ) : (
            <p>No withdrawals found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Transactions;

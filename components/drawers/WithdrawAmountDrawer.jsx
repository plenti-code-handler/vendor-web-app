"use client";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenDrawer } from "../../redux/slices/withdrawAmountSlice";
import { setOpenDrawer as setOpenSuccessDrawer } from "../../redux/slices/withdrawSuccessSlice";
import { crossIconWhiteSvg, payPalSvg, warningSvg } from "../../svgs";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../app/firebase/config";
import { getUserLocal } from "../../redux/slices/loggedInUserSlice";
import SuccessWithdrawDrawer from "./SuccessWithdrawDrawer";

const WithdrawAmountDrawer = () => {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.withdrawAmount.drawerOpen);
  const [loading, setLoading] = useState(false);
  const [iban, setIban] = useState("");
  const [localUser, setLocalUser] = useState(null);

  const [amount, setAmount] = useState("");
  // const currentBalance = 3150.7;
  const [currentBalance, setCurrentBalance] = useState(0);
  const isInsufficient = parseFloat(amount) > currentBalance;

  const handleClose = () => {
    dispatch(setOpenDrawer(false));
  };

  useEffect(() => {
    const user = getUserLocal();
    setLocalUser(user);
  }, []);

  const handleContinue = async () => {
    if (!isInsufficient && amount !== 0) {
      if (localUser) {
        try {
          // Generate a random 6-digit number
          const withdrawalNo = Math.floor(100000 + Math.random() * 900000);

          // Get the required details
          const vendorId = localUser.uid; // Assuming vendorId is the current user's ID
          const iban = localUser.bankDetails.iban; // Replace with the actual variable holding the IBAN
          const holderName = localUser.bankDetails.accountHolder; // Replace with the actual variable holding the holder name

          // Create a new withdrawal document
          await addDoc(collection(db, "withdrawals"), {
            vendorId: vendorId,
            createdAt: Timestamp.now(),
            amount: Number(amount),
            iban: iban,
            accountHolder: holderName,
            withdrawalno: withdrawalNo,
            status: "pending",
          });

          // Fetch the current revenue
          const userDocRef = doc(db, "users", vendorId);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const currentRevenue = userDocSnap.data().revenue;

            // Subtract the amount from the current revenue
            const updatedRevenue = currentRevenue - Number(amount);

            // Update the revenue in the user's document
            await updateDoc(userDocRef, {
              revenue: updatedRevenue,
            });

            // Dispatch actions to close the current drawer and open the success drawer
            dispatch(setOpenDrawer(false));
            dispatch(setOpenSuccessDrawer(true));
          } else {
            console.error("No such user document found!");
          }
        } catch (error) {
          console.error("Error processing withdrawal: ", error);
          // Handle error (e.g., show an error message to the user)
        }
      } else {
        console.error("No user is currently logged in");
        // Handle no user logged in scenario
      }
    }
  };

  useEffect(() => {
    const fetchIban = async () => {
      try {
        const user = auth.currentUser;

        console.log(user);

        if (user) {
          // Get a reference to the user's document
          const userDocRef = doc(collection(db, "users"), user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.bankDetails.iban) {
              setIban(userData.bankDetails?.iban);
              setCurrentBalance(userData.revenue);
            } else {
            }
          } else {
            console.error("No such document!");
          }
        } else {
          console.error("No user is currently logged in");
        }
      } catch (error) {
        console.error("Error fetching IBAN: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIban();
  }, []);

  const formatIban = (iban) => {
    return iban.replace(/(.{4})/g, "$1 ").trim();
  };

  return (
    <div className="relative z-999999 bg-gradient-custom">
      <Dialog open={open} onClose={handleClose} className="relative z-999999">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
        />
        <div className="fixed inset-0 overflow-hidden rounded-md">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-4">
              <DialogPanel
                transition
                className="pointer-events-auto relative w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700 bg-white"
              >
                <div className="flex h-full flex-col overflow-y-scroll py-5 shadow-xl bg-gradient-custom">
                  <DialogTitle className="flex px-4 sm:px-6 justify-between">
                    <p className="text-white font-semibold text-[18px]">
                      Withdraw Amount
                    </p>
                    <button
                      className="p-2 hover:bg-main rounded"
                      onClick={handleClose}
                    >
                      {crossIconWhiteSvg}
                    </button>
                  </DialogTitle>
                  <hr className="my-3 w-[90%] border-gray-300 ml-8" />
                  <div className="flex flex-col mt-3 pb-3 flex-1 px-4 sm:px-6 space-y-4 items-center gap-5">
                    <div className="flex justify-between items-center bg-[#8adbbf] shadow-lg transform translate-y-[-5px] p-2 rounded-lg mt-2 lg:w-[80%]">
                      <div className="flex gap-2 items-center">
                        {/* <span className="mt-1">{payPalSvg}</span> */}
                        <p className="text-white text-[16px] font-medium">
                          {iban ? formatIban(iban) : "Account Not Registered"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-center">
                      <p className="text-amountStatus text-[14px]">
                        Current Balance
                      </p>
                      <p className="text-amountStatus text-[16px] font-bold">
                        € {currentBalance.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex gap-2 items-center justify-center w-[50%]">
                      <p className="text-white text-[50px] font-bold">€</p>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="block placeholder-white/50 text-[50px] w-full rounded-lg border-none py-3 px-3 text-sm text-white focus:outline-none"
                        style={{
                          background:
                            "linear-gradient(to right, #74D5B3, #4AA887)",
                          WebkitBackgroundClip: "text",
                          color: "white",
                          fontSize: "50px",
                          cursorWidth: "1px",
                        }}
                        placeholder="0"
                      />
                    </div>

                    {isInsufficient && (
                      <div className="flex gap-2 items-center">
                        {warningSvg}
                        <p className="text-amountStatus text-[14px] font-medium">
                          Balance is insufficient
                        </p>
                      </div>
                    )}

                    <button
                      onClick={handleContinue}
                      className="flex justify-center bg-white text-black font-md py-2 rounded-3xl hover:bg-gray-200 gap-2 w-[90%] mt-5"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
      {true && <SuccessWithdrawDrawer amount={amount} iban={iban} />}
    </div>
  );
};

export default WithdrawAmountDrawer;

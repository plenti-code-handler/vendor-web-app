import React, { useEffect, useState } from "react";
import TextField from "../../../fields/TextField";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../../app/firebase/config";

const PaymentInfo = () => {
  const [view, setView] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [iban, setIban] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddPaymentClick = () => setView("addCard");
  const handleAddBankClick = async () => {
    try {
      const user = auth.currentUser;

      if (user) {
        // Get a reference to the user's document
        const userDocRef = doc(collection(db, "users"), user.uid);

        // Create the bank details object
        const bankDetails = {
          accountHolder: accountHolder,
          iban: iban,
        };

        // Update the bankDetails field in the user's document
        await updateDoc(userDocRef, {
          bankDetails: bankDetails,
        });

        // Set the view or handle success
        setView("linkedBank");
      } else {
        console.error("No user is currently logged in");
      }
    } catch (error) {
      console.error("Error adding bank details: ", error);
    }
  };

  const handleRemove = async () => {
    try {
      const user = auth.currentUser;

      if (user) {
        // Get a reference to the user's document
        const userDocRef = doc(collection(db, "users"), user.uid);

        // Set the bankDetails field to an empty object
        await updateDoc(userDocRef, {
          bankDetails: {},
        });

        console.log("Bank details cleared successfully");
        setView("initial");
        setIban("");
        setAccountHolder("");
      } else {
        console.error("No user is currently logged in");
      }
    } catch (error) {
      console.error("Error clearing bank details: ", error);
    }
  };

  useEffect(() => {
    const fetchIban = async () => {
      try {
        const user = auth.currentUser;
        console.log(auth.currentUser);

        if (user) {
          // Get a reference to the user's document
          const userDocRef = doc(collection(db, "users"), user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.bankDetails.iban) {
              setIban(userData.bankDetails?.iban);
              setView("linkedBank");
            } else {
              setView("initial");
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
    <div className="flex flex-col justify-center">
      {view === "initial" && (
        <div className="flex flex-col items-center gap-3">
          <p className="font-md text-[14px] text-gray-800 text-center">
            Add a bank using our secure payment system.
          </p>
          <button
            onClick={handleAddPaymentClick}
            className="flex justify-center bg-pinkBgDark text-white font-md py-2 rounded hover:bg-pinkBgDarkHover2 gap-2 w-[60%]"
          >
            Add Bank Information +
          </button>
        </div>
      )}

      {view === "addCard" && (
        <div className="flex flex-col gap-5">
          <p className="text-blackFour font-semibold text-[15px]">
            Add Bank Details
          </p>
          <div className="relative flex items-center flex-col gap-3">
            <input
              className="block w-full placeholder:font-bold rounded-lg border border-gray-300 py-3 px-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Account Holder Name"
              value={accountHolder}
              onChange={(e) => setAccountHolder(e.target.value)}
            />
            {/* <span className="absolute right-3 text-black font-bold mt-2">
              <img src="/masterCard.png" alt="MasterCard" />
            </span> */}
            <TextField
              placeholder="IBAN Number"
              value={iban}
              onChange={(e) => setIban(e.target.value)}
            />
          </div>
          <div className="flex gap-10 pt-2">
            <button
              onClick={() => setView("initial")}
              className="flex justify-center bg-white text-black border border-black font-md py-2 rounded hover:bg-grayTwo gap-2 w-[100%]"
            >
              Cancel
            </button>
            <button
              onClick={handleAddBankClick}
              className="flex justify-center bg-pinkBgDark text-white font-md py-2 rounded hover:bg-pinkBgDarkHover2 gap-2 w-[100%]"
            >
              Add
            </button>
          </div>
        </div>
      )}

      {view === "linkedBank" && (
        <div className="flex flex-col">
          <p className="text-blackFour font-semibold text-[15px]">
            Linked Bank
          </p>
          <div className="flex justify-between items-center bg-white shadow-md rounded-lg mt-5 p-4 mb-4 transform translate-y-[-10px] hover:translate-y-[-12px] transition-transform">
            <div className="flex gap-2">
              <p>{formatIban(iban)}</p>
            </div>
            <button
              onClick={handleRemove}
              className="underline-offset-2 text-[#EB001B] font-medium hover:cursor-pointer"
            >
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentInfo;

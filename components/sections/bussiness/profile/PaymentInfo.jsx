import React, { useEffect, useState } from "react";
import TextField from "../../../fields/TextField";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../../app/firebase/config";
import Loader from "../../../loader/loader";
import { toast } from "sonner";

const PaymentInfo = () => {
  const [view, setView] = useState("initial");
  const [accountHolder, setAccountHolder] = useState("");
  const [iban, setIban] = useState("");
  const [vat, setVat] = useState("");
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState("");

  const handleAddPaymentClick = () => setView("addCard");
  const handleAddBankClick = async () => {
    try {
      const user = auth.currentUser;
      console.log(iban);
      if (
        !validateName(accountHolder) ||
        !validateName(iban) ||
        !validateName(vat)
      ) {
        toast.error("Fields are empty or invalid"); // Show toast error
        return;
      }
      if (!validateIban(iban)) {
        setError("Invalid IBAN format");
        toast.error("Invalid IBAN format"); // Show toast error
        return;
      }

      if (!validateVat(vat)) {
        setError("Invalid VAT format");
        toast.error("Invalid VAT format"); // Show toast error
        return;
      }

      // Reset error
      setError("");
      if (user) {
        // Get a reference to the user's document
        const userDocRef = doc(collection(db, "users"), user.uid);

        // Create the bank details object
        const bankDetails = {
          accountHolder: accountHolder,
          iban: iban,
          vat,
        };

        // Update the bankDetails field in the user's document
        await updateDoc(userDocRef, {
          bankDetails: bankDetails,
        });

        // Set the view or handle success
        setView("linkedBank");

        toast.success("Data saved successfully!");
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
        setVat("");

        toast.success("Data removed successfully!");
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
        setLoader(true);
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
              setVat(userData.bankDetails.vat);
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
        setLoader(false);
      }
    };

    fetchIban();
  }, []);

  if (loader) return <Loader />;

  const validateIban = (value) => {
    const ibanRegex = /^[A-Z]{2}\d{2}(?:\s?[A-Z0-9]{1,30})*$/;
    return ibanRegex.test(value);
  };

  const validateVat = (value) => {
    const vatRegex = /^[A-Z]{2}\d{8,12}$/;
    return vatRegex.test(value);
  };

  const validateName = (value) => {
    if (value == "") {
      return false;
    }
    return true;
  };
  const formatIban = (value) => {
    // Remove all non-alphanumeric characters
    const cleanedValue = value.replace(/[^A-Z0-9]/g, "");

    // Format the cleaned value with spaces
    const formattedValue = cleanedValue.replace(/(.{4})/g, "$1 ").trim(); // Add space every 4 characters

    return formattedValue;
  };

  const handleIbanChange = (e) => {
    const value = e.target.value.toUpperCase(); // Convert to uppercase
    const formattedValue = formatIban(value); // Format with spaces
    setIban(formattedValue);
  };

  const handleVatChange = (e) => {
    const value = e.target.value.toUpperCase(); // Convert to uppercase
    setVat(value);
  };

  return (
    <div className="flex flex-col justify-center pt-[30px] pb-[30px]">
      {view === "initial" && (
        <div className="flex flex-col items-center gap-3">
          <p className="font-md text-sm text-gray-800 text-center">
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

            <TextField
              placeholder="IBAN Number"
              value={iban}
              onChange={handleIbanChange} // Update state with formatted value
            />

            <TextField
              placeholder="VAT Number"
              value={vat}
              onChange={handleVatChange} // Update state with formatted value
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

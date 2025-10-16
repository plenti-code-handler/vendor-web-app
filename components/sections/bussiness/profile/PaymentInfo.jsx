import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { PencilIcon } from "@heroicons/react/20/solid";
import Loader from "../../../loader/loader";
import { 
  selectBankAccountDetails, 
  selectBankAccountLoading, 
  selectBankAccountError,
  fetchBankAccountDetails,
  updateBankAccountDetails 
} from "../../../../redux/slices/vendorSlice";

// Status tag component
const StatusTag = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return {
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-200',
          icon: '✓',
          label: 'Active'
        };
      case 'PENDING':
        return {
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-200',
          icon: '⏳',
          label: 'Pending'
        };
      case 'INACTIVE':
        return {
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          borderColor: 'border-red-200',
          icon: '✗',
          label: 'Inactive'
        };
      default:
        return {
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200',
          icon: '?',
          label: 'Unknown'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.bgColor} ${config.borderColor}`}>
      <span className={`text-sm font-medium ${config.textColor}`}>
        {config.icon}
      </span>
      <span className={`text-sm font-medium ${config.textColor}`}>
        {config.label}
      </span>
    </div>
  );
};

const PaymentInfo = () => {
  const dispatch = useDispatch();
  const bankAccountDetails = useSelector(selectBankAccountDetails);
  const bankAccountLoading = useSelector(selectBankAccountLoading);
  const bankAccountError = useSelector(selectBankAccountError);
  
  const [view, setView] = useState("initial");
  const [accountHolder, setAccountHolder] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [bankName, setBankName] = useState("");
  const [status, setStatus] = useState("");
  const [fetchedOnce, setFetchedOnce] = useState(false);

  useEffect(() => {
    if (!bankAccountDetails && !fetchedOnce) {
      dispatch(fetchBankAccountDetails());
      setFetchedOnce(true);
    }
  }, [dispatch, bankAccountDetails, fetchedOnce]);

  // Update local state when bank account details are loaded
  useEffect(() => {
    if (bankAccountDetails) {
      console.log("bank account data", bankAccountDetails);
      
      if (bankAccountDetails?.account_number) {
        setAccountNumber('******* ' + bankAccountDetails.account_number);
        setIfscCode(bankAccountDetails.ifsc_code);
        setBankName(bankAccountDetails.bank_name);
        setAccountHolder(bankAccountDetails.account_holder_name);
        setStatus(bankAccountDetails.status || "");
        setView("linkedBank");
      } else {
        setView("initial");
      }
    }
  }, [bankAccountDetails]);

  // Submit bank details
  const handleAddBankClick = async () => {
    if (!accountHolder || !accountNumber || !ifscCode || !bankName) {
      toast.error("All fields are required");
      return;
    }

    try {
      const bankData = {
        account_number: accountNumber,
        ifsc_code: ifscCode,
        bank_name: bankName,
        account_holder_name: accountHolder,
      };

      const result = await dispatch(updateBankAccountDetails(bankData)).unwrap();
      console.log("Bank details update result:", result);
      
      toast.success("Bank details saved successfully!");
      setView("linkedBank");
    } catch (error) {
      console.log("inside add account details error");
      console.log(error);
      toast.error("Failed to save bank details. Please try again.");
      console.error("Error saving bank details:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center p-6 w-full ">
      {bankAccountLoading ? (
        <Loader />
      ) : (
        <>
          {view === "initial" && (
            <div className="flex flex-col items-center gap-4">
              <p className="text-gray-700 text-center">
                Add your bank details securely.
              </p>
              <button
                onClick={() => setView("addCard")}
                className="bg-primary text-white px-6 py-2 rounded-md hover:bg-[#7e45ee] transition"
              >
                Add Bank Information +
              </button>
            </div>
          )}

          {view === "linkedBank" && (
            <div className="w-full bg-white border p-6 rounded-lg shadow">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">
                  Linked Bank Details
                </h2>
                <div className="flex items-center gap-3">
                  <StatusTag status={status} />
                  <button
                    onClick={() => setView("addCard")}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full hover:bg-[#7e45ee] transition-colors"
                  >
                    <PencilIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">Edit</span>
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Holder Name
                </label>
                <div className="w-full p-3 border rounded-lg bg-gray-50">
                  {accountHolder}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Number
                </label>
                <div className="w-full p-3 border rounded-lg bg-gray-50">
                  {accountNumber}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  IFSC Code
                </label>
                <div className="w-full p-3 border rounded-lg bg-gray-50">
                  {ifscCode}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Name
                </label>
                <div className="w-full p-3 border rounded-lg bg-gray-50">
                  {bankName}
                </div>
              </div>
            </div>
          )}

          {view === "addCard" && (
            <div className="bg-white p-6 w-full border rounded-full shadow">
              <h2 className="text-xl font-semibold mb-4">
                Add / Edit Bank Details
              </h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Holder Name
                </label>
                <input
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Number
                </label>
                <input
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  IFSC Code
                </label>
                <input
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Name
                </label>
                <input
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() =>
                    setView(accountNumber ? "linkedBank" : "initial")
                  }
                  className="w-full bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddBankClick}
                  className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-[#7e45ee] transition"
                  disabled={bankAccountLoading}
                >
                  {bankAccountLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PaymentInfo;

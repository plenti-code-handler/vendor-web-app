import React, { useEffect, useState } from "react";
import axiosClient from "../../../../AxiosClient";
import { toast } from "sonner";
import { PencilIcon } from "@heroicons/react/20/solid";
import Loader from "../../../loader/loader";

const PaymentInfo = () => {
  const [view, setView] = useState("initial");
  const [accountHolder, setAccountHolder] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [bankName, setBankName] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchedOnce, setFetchedOnce] = useState(false);

  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        const response = await axiosClient.get(
          "/v1/vendor/me/account-details/get"
        );
        const data = response?.data;

        if (data?.account_number) {
          setAccountNumber('******* ' + data.account_number);
          setIfscCode(data.ifsc_code);
          setBankName(data.bank_name);
          setAccountHolder(data.account_holder_name);
          setView("linkedBank");
        } else {
          setView("initial");
        }

        setFetchedOnce(true);
      } catch (error) {
        console.log("inside fetach account details error");
        console.error("Error fetching bank details:", error);
        setView("initial");
        setFetchedOnce(true);
      }
    };

    fetchBankDetails();
  }, []);

  // Submit bank details
  const handleAddBankClick = async () => {
    if (!accountHolder || !accountNumber || !ifscCode || !bankName) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosClient.post(
        "/v1/vendor/me/add-account-details",
        {
          account_number: accountNumber,
          ifsc_code: ifscCode,
          bank_name: bankName,
          account_holder_name: accountHolder,
        },
        {
          headers: { Accept: "application/json" },
        }
      );

      toast.success("Bank details saved successfully!");
      setView("linkedBank");
    } catch (error) {
      console.log("inside add account details error");
      console.log(error);
      toast.error("Failed to save bank details. Please try again.");
      console.error("Error saving bank details:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center p-6 w-full ">
      {!fetchedOnce ? (
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
            <div className="relative w-full bg-white border p-6 rounded-lg shadow">
              <div
                className="absolute top-4 right-4 cursor-pointer"
                onClick={() => setView("addCard")}
              >
                <PencilIcon className="w-6 h-6 text-[#7a48e3] bg-white p-1 rounded-full shadow" />
              </div>
              <h2 className="text-xl font-semibold mb-4">
                Linked Bank Details
              </h2>

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
            <div className="bg-white p-6 w-full border rounded-lg shadow">
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
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
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

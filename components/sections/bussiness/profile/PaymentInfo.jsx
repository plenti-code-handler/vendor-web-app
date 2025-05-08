import React, { useEffect, useState } from "react";
import axiosClient from "../../../../AxiosClient";
import { toast } from "sonner";
import { PencilIcon } from "@heroicons/react/20/solid";

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
          setAccountNumber(data.account_number);
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
        <p className="text-center">Loading bank information...</p>
      ) : (
        <>
          {/* Show Add Button */}
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

          {/* Show Existing Details with Edit Option */}
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
              <p>
                <strong>Account Holder:</strong> {accountHolder}
              </p>
              <p>
                <strong>Account Number:</strong> {accountNumber}
              </p>
              <p>
                <strong>IFSC Code:</strong> {ifscCode}
              </p>
              <p>
                <strong>Bank Name:</strong> {bankName}
              </p>
            </div>
          )}

          {/* Add or Edit Form */}
          {view === "addCard" && (
            <div className="bg-white p-6 w-full border rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">
                Add / Edit Bank Details
              </h2>
              <input
                className="w-full p-3 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Account Holder Name"
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
              />
              <input
                className="w-full p-3 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Account Number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
              <input
                className="w-full p-3 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="IFSC Code"
                value={ifscCode}
                onChange={(e) => setIfscCode(e.target.value)}
              />
              <input
                className="w-full p-3 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Bank Name"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
              />
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

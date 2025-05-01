import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import axiosClient from "../../../../AxiosClient";

const PaymentInfo = () => {
  const [view, setView] = useState("initial");
  const [accountHolder, setAccountHolder] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [bankName, setBankName] = useState("");
  const [loading, setLoading] = useState(false);

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
          headers: {
            Accept: "application/json",
          },
        }
      );

      console.log("Card response from backend");
      console.log(response);

      toast.success("Bank details added successfully!");
      setView("linkedBank");
    } catch (error) {
      toast.error("Failed to add bank details. Please try again.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center p-6">
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

      {view === "addCard" && (
        <div className="bg-white p-6 w-full ">
          <h2 className="text-xl font-semibold mb-4">Add Bank Details</h2>
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
              onClick={() => setView("initial")}
              className="w-full bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleAddBankClick}
              className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-[#7e45ee] transition"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentInfo;

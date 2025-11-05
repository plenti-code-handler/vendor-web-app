import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { PencilIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/20/solid";
import Loader from "../../../loader/loader";
import { 
  selectBankAccountDetails, 
  selectBankAccountLoading,
  fetchBankAccountDetails,
  updateBankAccountDetails 
} from "../../../../redux/slices/vendorSlice";

const STATUS_CONFIG = {
  ACTIVE: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', icon: '✓', label: 'Active' },
  PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200', icon: '⏳', label: 'Pending' },
  INACTIVE: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200', icon: '✗', label: 'Inactive' },
};

const StatusTag = ({ status }) => {
  const config = STATUS_CONFIG[status?.toUpperCase()] || STATUS_CONFIG.INACTIVE;
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.bg} ${config.border}`}>
      <span className={`text-sm font-medium ${config.text}`}>{config.icon} {config.label}</span>
    </div>
  );
};

const ValidationIcon = ({ valid, loading }) => {
  if (loading) return <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent" />;
  if (valid === null) return null;
  return valid ? <CheckCircleIcon className="w-5 h-5 text-green-500" /> : <XCircleIcon className="w-5 h-5 text-red-500" />;
};

const PaymentInfo = () => {
  const dispatch = useDispatch();
  const bankAccountDetails = useSelector(selectBankAccountDetails);
  const loading = useSelector(selectBankAccountLoading);
  
  const [view, setView] = useState("initial");
  const [form, setForm] = useState({ accountHolder: "", accountNumber: "", ifscCode: "", bankName: "" });
  const [validation, setValidation] = useState({ ifsc: null, account: null, validatingIFSC: false });

  useEffect(() => {
    if (!bankAccountDetails) dispatch(fetchBankAccountDetails());
  }, [dispatch, bankAccountDetails]);

  useEffect(() => {
    if (bankAccountDetails?.account_number) {
      setForm({
        accountHolder: bankAccountDetails.account_holder_name,
        accountNumber: '******* ' + bankAccountDetails.account_number.slice(-4),
        ifscCode: bankAccountDetails.ifsc_code,
        bankName: bankAccountDetails.bank_name
      });
      setView("linkedBank");
    }
  }, [bankAccountDetails]);

  const validateIFSC = async (code) => {
    if (code.length !== 11) return setValidation(v => ({ ...v, ifsc: false }));
    setValidation(v => ({ ...v, validatingIFSC: true }));
    try {
      const res = await fetch(`https://ifsc.razorpay.com/${code}`);
      if (res.ok) {
        const data = await res.json();
        setForm(f => ({ ...f, bankName: data.BANK }));
        setValidation(v => ({ ...v, ifsc: true, validatingIFSC: false }));
        toast.success(`Verified: ${data.BANK}`);
      } else {
        setValidation(v => ({ ...v, ifsc: false, validatingIFSC: false }));
        setForm(f => ({ ...f, bankName: "" }));
        toast.error("Invalid IFSC code");
      }
    } catch {
      setValidation(v => ({ ...v, ifsc: false, validatingIFSC: false }));
      toast.error("Failed to validate IFSC");
    }
  };

  const handleInput = (field, value) => {
    if (field === 'ifscCode') {
      const upper = value.toUpperCase();
      setForm(f => ({ ...f, ifscCode: upper }));
      if (upper.length === 11) validateIFSC(upper);
      else setValidation(v => ({ ...v, ifsc: null }));
    } else if (field === 'accountNumber') {
      const cleaned = value.replace(/\D/g, '');
      setForm(f => ({ ...f, accountNumber: cleaned }));
      setValidation(v => ({ ...v, account: cleaned.length >= 9 && cleaned.length <= 18 ? true : (cleaned.length > 0 ? false : null) }));
    } else {
      setForm(f => ({ ...f, [field]: value }));
    }
  };

  const handleSave = async () => {
    if (!form.accountHolder || !form.accountNumber || !form.ifscCode || !form.bankName) {
      return toast.error("All fields are required");
    }
    if (validation.ifsc === false) return toast.error("Invalid IFSC code");
    if (validation.account === false) return toast.error("Invalid account number (9-18 digits)");

    try {
      await dispatch(updateBankAccountDetails({
        account_number: form.accountNumber,
        ifsc_code: form.ifscCode,
        bank_name: form.bankName,
        account_holder_name: form.accountHolder,
      })).unwrap();
      toast.success("Bank details saved");
      setView("linkedBank");
    } catch {
      toast.error("Failed to save");
    }
  };

  const handleEdit = () => {
    setForm({ accountHolder: "", accountNumber: "", ifscCode: "", bankName: "" });
    setValidation({ ifsc: null, account: null, validatingIFSC: false });
    setView("addCard");
  };

  const handleCancel = () => {
    if (bankAccountDetails?.account_number) {
      setForm({
        accountHolder: bankAccountDetails.account_holder_name,
        accountNumber: '******* ' + bankAccountDetails.account_number.slice(-4),
        ifscCode: bankAccountDetails.ifsc_code,
        bankName: bankAccountDetails.bank_name
      });
      setView("linkedBank");
    } else {
      setView("initial");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="flex flex-col justify-center p-6 w-full">
      {view === "initial" && (
        <div className="flex flex-col items-center gap-4">
          <p className="text-gray-700 text-center">Add your bank details securely.</p>
          <button onClick={() => setView("addCard")} className="bg-primary text-white px-6 py-2 rounded-md hover:bg-[#7e45ee] transition">
            Add Bank Information +
          </button>
        </div>
      )}

      {view === "linkedBank" && (
        <div className="w-full bg-white border p-6 rounded-lg shadow">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold">Linked Bank Details</h2>
            <div className="flex items-center gap-3">
              <StatusTag status={bankAccountDetails?.status} />
              <button onClick={handleEdit} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full hover:bg-[#7e45ee] transition">
                <PencilIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Edit</span>
              </button>
            </div>
          </div>
          {['accountHolder', 'accountNumber', 'ifscCode', 'bankName'].map(field => (
            <div key={field} className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                {field.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <div className="w-full p-3 border rounded-lg bg-gray-50">{form[field]}</div>
            </div>
          ))}
        </div>
      )}

      {view === "addCard" && (
        <div className="bg-white p-6 w-full border rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Add / Edit Bank Details</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
            <input
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.accountHolder}
              onChange={(e) => handleInput('accountHolder', e.target.value)}
              placeholder="Enter account holder name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
            <div className="relative">
              <input
                className={`w-full p-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 ${
                  validation.account === false ? 'border-red-500 focus:ring-red-500' :
                  validation.account === true ? 'border-green-500 focus:ring-green-500' : 'focus:ring-blue-500'
                }`}
                value={form.accountNumber}
                onChange={(e) => handleInput('accountNumber', e.target.value)}
                placeholder="9-18 digits"
                maxLength={18}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <ValidationIcon valid={validation.account} />
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
            <div className="relative">
              <input
                className={`w-full p-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 uppercase ${
                  validation.ifsc === false ? 'border-red-500 focus:ring-red-500' :
                  validation.ifsc === true ? 'border-green-500 focus:ring-green-500' : 'focus:ring-blue-500'
                }`}
                value={form.ifscCode}
                onChange={(e) => handleInput('ifscCode', e.target.value)}
                placeholder="11 characters"
                maxLength={11}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <ValidationIcon valid={validation.ifsc} loading={validation.validatingIFSC} />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Example: SBIN0001234</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
            <input
              className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none"
              value={form.bankName}
              readOnly={validation.ifsc === true}
              onChange={(e) => setForm(f => ({ ...f, bankName: e.target.value }))}
              placeholder="Auto-filled from IFSC"
            />
          </div>

          <div className="flex gap-4">
            <button onClick={handleCancel} className="w-full bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400 transition">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading || validation.ifsc === false || validation.account === false}
              className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-[#7e45ee] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentInfo;

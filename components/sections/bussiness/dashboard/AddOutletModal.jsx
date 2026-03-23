"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import PrimaryButton from "../../../buttons/PrimaryButton";
import {
  addParentOutlet,
  fetchParentOutlets,
} from "../../../../redux/slices/parentSlice";

const AddOutletModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setUsername("");
    setIsSubmitting(false);
  }, [open]);

  const handleSubmit = async () => {
    const clean = username.trim();
    if (!clean) {
      toast.error("Please enter outlet username");
      return;
    }

    try {
      setIsSubmitting(true);
      await dispatch(addParentOutlet({ username: clean })).unwrap();
      toast.success("Outlet added successfully!");
      dispatch(fetchParentOutlets());
      onClose?.();
    } catch (e) {
      const detail =
        e?.response?.data?.detail ||
        e?.response?.data?.message ||
        e?.message ||
        "Failed to add outlet";
      toast.error(detail);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/40 transition-opacity duration-300 data-[closed]:opacity-0"
      />
      <div className="fixed inset-0 flex items-start justify-center overflow-y-auto pt-6">
        <DialogPanel
          transition
          className="w-full max-w-2xl p-2 pt-5 h-[100vh] flex flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl transform transition duration-300 ease-out data-[closed]:translate-y-full"
        >
          <div className="flex items-center justify-between px-4 pb-2 border-b border-gray-100">
            <h2 className="text-lg font-semibold">Add outlet</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100"
              aria-label="Close"
            >
              <XMarkIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Outlet username
                </label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. username_of_the_outlet"
                  className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#5F22D9]/20 focus:border-[#5F22D9]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-3 text-sm rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <PrimaryButton
                  loading={isSubmitting}
                  loadingText="Adding..."
                  onClick={handleSubmit}
                  className="px-4 py-2 text-sm rounded-xl"
                >
                  Add existing outlet +
                </PrimaryButton>
              </div>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default AddOutletModal;


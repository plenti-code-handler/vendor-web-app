"use client";

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { fetchReviews } from "../../../../redux/slices/ratingSlice";
import RatingsContent from "../../../common/RatingsContent";

const RatingsModal = ({ open, onClose }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (open) {
      dispatch(fetchReviews({ skip: 0, limit: 10 }));
    }
  }, [open, dispatch]);

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/40 transition-opacity duration-300 data-[closed]:opacity-0"
      />
      <div className="fixed inset-0 flex items-end justify-center">
        <DialogPanel
          transition
          className="w-full max-w-2xl p-2 pt-5 max-h-[85vh] flex flex-col rounded-t-2xl bg-white shadow-xl transform transition duration-300 ease-out data-[closed]:translate-y-full"
        >
          <div className="flex items-center justify-between px-4 pb-2 border-b border-gray-100">
            <h2 className="text-lg font-semibold">Ratings &amp; Reviews</h2>
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
            <RatingsContent reviewsSectionTitle="All reviews" />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default RatingsModal;
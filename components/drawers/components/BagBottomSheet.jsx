"use client";

import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";

const BagBottomSheet = ({ open, onClose, children }) => (
  <Dialog open={open} onClose={onClose} className="relative z-50">
    <DialogBackdrop
      transition
      className="fixed inset-0 bg-black/40 transition-opacity duration-300 data-[closed]:opacity-0"
    />
    <div className="fixed inset-0 flex items-end justify-center">
      <DialogPanel
        transition
        className="w-full max-w-2xl p-2 pt-5 h-full max-h-[85vh] flex flex-col rounded-t-2xl bg-white shadow-xl transform transition duration-300 ease-out data-[closed]:translate-y-full"
      >
        {children}
      </DialogPanel>
    </div>
  </Dialog>
);

export default BagBottomSheet;

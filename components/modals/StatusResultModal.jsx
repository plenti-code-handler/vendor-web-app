"use client";

import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useBackToClose } from "../../hooks/useBackToCloseModal";

const VARIANTS = {
  success: {
    title: "Success",
    icon: CheckCircleIcon,
    iconWrap: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    button: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25",
  },
  error: {
    title: "Something went wrong",
    icon: ExclamationCircleIcon,
    iconWrap: "bg-red-50 text-red-600 ring-red-100",
    button: "bg-red-600 hover:bg-red-700 shadow-red-600/25",
  },
  confirm: {
    title: "Are you sure?",
    icon: ExclamationCircleIcon,
    iconWrap: "bg-amber-50 text-amber-600 ring-amber-100",
    button: "bg-amber-600 hover:bg-amber-700 shadow-amber-600/25",
  },
};

const StatusResultModal = ({
  open,
  onClose,
  variant = "success",
  title,
  message = "",
  onConfirm,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  confirmLoading = false,
  className = "relative z-[60]",
  enableBackToClose = true,
}) => {
  useBackToClose(enableBackToClose ? open : false, onClose);

  const config = VARIANTS[variant] ?? VARIANTS.success;
  const Icon = config.icon;
  const heading = title || config.title;

  return (
    <Dialog open={open} onClose={onClose} className={className}>
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/40 transition-opacity duration-300 data-[closed]:opacity-0"
      />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          transition
          className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl transform transition duration-300 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          <div className="flex items-start justify-between gap-3">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ring-4 ${config.iconWrap}`}
            >
              <Icon className="h-7 w-7" aria-hidden="true" />
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              aria-label="Close"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">{heading}</h2>
            {message ? (
              <p className="text-sm leading-relaxed text-slate-600">{message}</p>
            ) : null}
          </div>

          {variant === "confirm" && onConfirm ? (
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={confirmLoading}
                className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={confirmLoading}
                className={`inline-flex flex-1 items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-md transition disabled:opacity-60 ${config.button}`}
              >
                {confirmLoading ? "Loading..." : confirmLabel}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className={`mt-6 inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-md transition ${config.button}`}
            >
              OK
            </button>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default StatusResultModal;

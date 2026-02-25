"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { XMarkIcon, PlusIcon } from "@heroicons/react/24/solid";
import { calculatePrices } from "../../utility/priceCalculations";
import PricingCardRow from "../sections/bussiness/profile/PricingCardRow";
import PrimaryButton from "../buttons/PrimaryButton";
import { ITEM_TYPE_DISPLAY_NAMES } from "../../constants/itemTypes";
import { toast } from "sonner";

const slugify = (s) =>
  String(s)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "") || "default";

const AddPricingModal = ({
  open,
  onClose,
  itemType: itemTypeProp,
  editEntry = null,
  existingEntriesForItemType = [],
  onSave,
}) => {
  const itemType = itemTypeProp ?? "MEAL";
  const isEdit = Boolean(editEntry);
  const isDefaultEntry = isEdit && String(editEntry?.id ?? "default") === "default";
  const [asp, setAsp] = useState("");
  const [name, setName] = useState("");
  const [descriptions, setDescriptions] = useState([]);
  const [descriptionInput, setDescriptionInput] = useState("");
  const [showCards, setShowCards] = useState(false);

  useEffect(() => {
    if (open) {
      if (editEntry) {
        setAsp(String(editEntry.asp ?? ""));
        setName(editEntry.name || editEntry.id || "");
        setDescriptions(Array.isArray(editEntry.descriptions) ? [...editEntry.descriptions] : []);
      } else {
        setAsp("");
        setName("");
        setDescriptions([]);
      }
      setDescriptionInput("");
      setShowCards(false);
    }
  }, [open, editEntry]);

  const aspNum = parseFloat(asp);
  const prices =
    asp && !isNaN(aspNum) && aspNum > 0
      ? calculatePrices(aspNum, itemType)
      : null;

  useEffect(() => {
    if (open && prices) {
      const t = setTimeout(() => setShowCards(true), 200);
      return () => clearTimeout(t);
    }
  }, [open, prices]);

  const handleAddDescription = () => {
    const text = descriptionInput.trim();
    if (!text) return;
    setDescriptions((prev) => [...prev, text]);
    setDescriptionInput("");
  };

  const handleRemoveDescription = (index) => {
    setDescriptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const id = isEdit ? String(editEntry.id ?? "default") : (slugify(name) || "default");
    if (!name.trim()) {
      toast.error("Enter a name for this pricing");
      return;
    }
    if (!isEdit && id === "default") {
      toast.error("Use a different name (e.g. summer_cool, premium)");
      return;
    }
    const existingIds = (existingEntriesForItemType || [])
      .filter((e) => !isEdit || String(e.id ?? "default") !== String(editEntry?.id ?? "default"))
      .map((e) => String(e.id ?? "default"));
    if (existingIds.includes(id)) {
      toast.error("This item type already has a pricing with this name. Use a different name.");
      return;
    }
    if (!prices) {
      toast.error("Enter a valid ASP to see pricing");
      return;
    }
    if (id !== "default" && descriptions.length === 0) {
      toast.error("Add at least one description for non-default pricing");
      return;
    }

    const entry = {
      item_type: itemType,
      id,
      name: name.trim(),
      asp: Math.round(aspNum),
      bags: {
        SMALL: prices.small.price,
        MEDIUM: prices.medium.price,
        LARGE: prices.large.price,
      },
      cuts: {
        SMALL: prices.small.cut,
        MEDIUM: prices.medium.cut,
        LARGE: prices.large.cut,
      },
      descriptions: [...descriptions],
    };
    onSave(entry, editEntry);
    onClose();
  };

  return (
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
          <div className="flex items-center justify-between px-4 pb-2 border-b border-gray-100">
            <h2 className="text-lg font-semibold">
              {isEdit ? "Edit pricing" : "Add new pricing"} – {ITEM_TYPE_DISPLAY_NAMES[itemType] ?? itemType}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100"
              aria-label="Close"
            >
              <XMarkIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Average selling price (ASP) ₹
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={asp}
                onChange={(e) => setAsp(e.target.value)}
                placeholder="e.g. 200"
                className="w-full max-w-[180px] px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#5F22D9] focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Pricing name (e.g. Rice Items, Premium Items)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Summer Cool"
                readOnly={isEdit && (editEntry?.id ?? "default") === "default"}
                className={`w-full max-w-[280px] px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#5F22D9] focus:border-transparent ${isEdit && (editEntry?.id ?? "default") === "default" ? "bg-gray-100" : ""}`}
              />
              {isEdit && (editEntry?.id ?? "default") === "default" && (
                <p className="text-xs text-gray-500">Default pricing name cannot be changed.</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Descriptions (add sentences)
              </label>
              <div className="flex gap-2 flex-wrap">
                <input
                  type="text"
                  value={descriptionInput}
                  onChange={(e) => setDescriptionInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddDescription())}
                  placeholder="e.g. Best for summer meals"
                  className="flex-1 min-w-[160px] px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#5F22D9] focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={handleAddDescription}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-[#5F22D9] text-white text-sm font-medium hover:bg-[#4A1BB8]"
                >
                  <PlusIcon className="w-4 h-4" /> Add +
                </button>
              </div>
              {descriptions.length > 0 && (
                <ul className="flex flex-wrap gap-2 mt-2">
                  {descriptions.map((text, index) => (
                    <li
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 text-gray-800 text-xs"
                    >
                      {text}
                      <button
                        type="button"
                        onClick={() => handleRemoveDescription(index)}
                        className="p-0.5 rounded hover:bg-gray-200"
                        aria-label="Remove"
                      >
                        <XMarkIcon className="w-3 h-3" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {prices && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700">
                  Preview – based on ASP ₹{asp}
                </p>
                <PricingCardRow prices={prices} showCards={showCards} />
              </div>
            )}
          </div>

          <div className="px-4 py-3 border-t border-gray-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <PrimaryButton onClick={handleSubmit}>{isEdit ? "Save" : "Add pricing"}</PrimaryButton>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default AddPricingModal;

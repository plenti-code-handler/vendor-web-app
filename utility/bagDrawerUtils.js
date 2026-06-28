import {
  isUnixInstantWithinOpeningWindow,
  STORE_HOURS_TIMEZONE,
} from "./openingHoursTimeOptions";

export const ALLERGENS_OPTIONS = [
  { value: "RED_MEAT", label: "Red Meat", emoji: "🥩" },
  { value: "SUGAR", label: "Sugar", emoji: "🍬" },
  { value: "ROOT_VEGETABLES", label: "Root Vegetables", emoji: "🥕" },
  { value: "WHEAT", label: "Wheat", emoji: "🌾" },
  { value: "MAIDA", label: "Maida", emoji: "🍞" },
  { value: "PEANUTS", label: "Peanuts", emoji: "🥜" },
  { value: "TREE_NUTS", label: "Tree Nuts", emoji: "🌰" },
  { value: "DAIRY", label: "Dairy", emoji: "🥛" },
  { value: "EGGS", label: "Eggs", emoji: "🥚" },
  { value: "SOY", label: "Soy", emoji: "🫘" },
  { value: "FISH", label: "Fish", emoji: "🐟" },
  { value: "SHELLFISH", label: "Shellfish", emoji: "🦐" },
  { value: "BEEF", label: "Beef", emoji: "🐄" },
  { value: "PORK", label: "Pork", emoji: "🐷" },
  { value: "ONION", label: "Onion", emoji: "🧅" },
  { value: "GARLIC", label: "Garlic", emoji: "🧄" },
];

// Rest of your existing code...

// Common validation fields
export const getRequiredFields = (selectedBag, description, isVeg, isNonVeg, vegServings, nonVegServings) => [
  {
    field: selectedBag,
    name: "selectedBag",
    message: "Please select an item type.",
    validate: (field) => field && field.trim() !== "",
  },
  {
    field: description,
    name: "description",
    message: "Please fill the description.",
    validate: (field) => field && field.trim() !== "",
  },
  {
    field: vegServings + nonVegServings,
    name: "servings",
    message: "Please provide at least one serving count.",
    validate: (field) => field > 0,
  },
];

/**
 * Validates pickup window / best-before ordering only.
 * Store hours are surfaced inline in TimingSection (no toast for hours).
 */
export const validateTimeConstraints = (windowStartTime, windowEndTime, bestBeforeTime) => {
  if (windowEndTime < windowStartTime) {
    return "End time must be after start time!";
  }
  if (bestBeforeTime < windowEndTime) {
    return "Best before time cannot be before window end time!";
  }

  return null;
};

// Common time change handlers
export const handleStartTimeChange = (date, setWindowStartTime, setWindowEndTime, setBestBeforeTime) => {
  setWindowStartTime(date);
  const newEndTime = new Date(date.getTime() + 30 * 60000);
  setWindowEndTime(newEndTime);
  const newBestBeforeTime = new Date(newEndTime.getTime() + 60 * 60000);
  setBestBeforeTime(newBestBeforeTime);
};

export const handleEndTimeChange = (date, windowStartTime, setWindowEndTime, setBestBeforeTime, toast) => {
  if (date < new Date()) {
    toast.error("End time cannot be in the past!");
    return;
  }

  if (date < windowStartTime) {
    toast.error("End time cannot be before start time!");
    return;
  }

  setWindowEndTime(date);
  const newBestBeforeTime = new Date(date.getTime() + 60 * 60000);
  setBestBeforeTime(newBestBeforeTime);
};

export const handleBestBeforeTimeChange = (date, windowEndTime, setBestBeforeTime, toast) => {
  if (date < new Date()) {
    toast.error("Best before time cannot be in the past!");
    return;
  }

  if (date < windowEndTime) {
    toast.error("Best before time cannot be before window end time!");
    return;
  }

  setBestBeforeTime(date);
};

// Common form reset
export const getResetFormValues = () => ({
  selectedBag: "MEAL",
  selectedAllergens: [],
  description: "",
  vegServings: 0,
  nonVegServings: 0,
  windowStartTime: new Date(),
  windowEndTime: new Date(),
  bestBeforeTime: new Date(),
  currentStep: 1,
});

/**
 * Get descriptions list for the description dropdown.
 * Default pricing → vendor's availableDescriptions; else → pricing entry's descriptions, or fallback to availableDescriptions.
 */
export const getDescriptionsForDropdown = (selectedPricingId, selectedBag, pricing, availableDescriptions) => {
  if (selectedPricingId === 'default' || !selectedBag) return availableDescriptions ?? [];
  const entry = (pricing ?? []).find(
    (e) => String(e.item_type) === String(selectedBag) && String(e.id ?? 'default') === String(selectedPricingId)
  );
  const list = entry?.descriptions;
  if (Array.isArray(list) && list.length > 0) return list;
  return availableDescriptions ?? [];
};

export const PICKUP_OUTSIDE_HOURS_MESSAGE =
  "Your pickup window ends outside your operational hours. Adjust the pickup window time or duration so the end time falls within your operational hours.";

export function isPickupEndOutsideStoreHours(windowEndTime, openingHours) {
  if (!openingHours?.closeTime?.trim()) return false;
  if (!(windowEndTime instanceof Date) || Number.isNaN(windowEndTime.getTime())) return false;
  const unixSec = Math.floor(windowEndTime.getTime() / 1000);
  return !isUnixInstantWithinOpeningWindow(
    unixSec,
    openingHours.openTime,
    openingHours.closeTime,
    STORE_HOURS_TIMEZONE
  );
}

// Re-export catalogue helper for backward compatibility (implementation in catalogueUtils.js)
export { getAvailableCategories } from './catalogueUtils';

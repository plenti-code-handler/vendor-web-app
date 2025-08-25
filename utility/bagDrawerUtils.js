// Common allergens options
export const ALLERGENS_OPTIONS = [
  "PEANUTS", "TREE NUTS", "MILK", "EGGS", "WHEAT", "SOY", 
  "FISH", "SHELLFISH", "BEEF", "PORK", "ONION", "GARLIC"
];

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
    field: isVeg || isNonVeg,
    name: "diet",
    message: "Please select at least one diet option (Veg/Non-Veg).",
    validate: (field) => field === true,
  },
  {
    field: vegServings + nonVegServings,
    name: "servings",
    message: "Please provide at least one serving count.",
    validate: (field) => field > 0,
  },
];

// Common time validation
export const validateTimeConstraints = (windowStartTime, windowEndTime, bestBeforeTime) => {
  if (windowEndTime < windowStartTime) {
    return "End time must be after start time!";
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
  isVeg: true,
  isNonVeg: false,
  showCustomDescription: false,
  currentStep: 1,
});

// Common available categories function
export const getAvailableCategories = (itemTypes) => {
  const { ALL_ITEM_TYPES } = require('../constants/itemTypes');
  return ALL_ITEM_TYPES.filter(itemType => {
    const catalogueItem = itemTypes[itemType];
    return catalogueItem && catalogueItem.bags && Object.keys(catalogueItem.bags).length > 0;
  });
};

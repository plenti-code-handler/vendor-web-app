// Item Types Configuration - Easy to add new types
export const ITEM_TYPES_CONFIG = {
  MEAL: {
    value: 'MEAL',
    displayName: 'Meal',
    icon: '🍛',
    description: 'Full meals and main courses'
  },
  BAKED_GOODS: {
    value: 'BAKED_GOODS',
    displayName: 'Bakery',
    icon: '🧁',
    description: 'Bread, pastries, and baked items'
  },
  SNACKS_AND_DESSERT: {
    value: 'SNACKS_AND_DESSERT',
    displayName: 'Pantry',
    icon: '🍟',
    description: 'Snacks, desserts, and treats'
  }
};

// Derived constants for backward compatibility and convenience
export const ITEM_TYPES = Object.fromEntries(
  Object.entries(ITEM_TYPES_CONFIG).map(([key, config]) => [key, config.value])
);

export const ALL_ITEM_TYPES = Object.values(ITEM_TYPES);

export const ITEM_TYPE_DISPLAY_NAMES = Object.fromEntries(
  Object.entries(ITEM_TYPES_CONFIG).map(([key, config]) => [config.value, config.displayName])
);

export const ITEM_TYPE_ICONS = Object.fromEntries(
  Object.entries(ITEM_TYPES_CONFIG).map(([key, config]) => [config.value, config.icon])
);

export const ITEM_TYPE_DESCRIPTIONS = Object.fromEntries(
  Object.entries(ITEM_TYPES_CONFIG).map(([key, config]) => [config.value, config.description])
);

// Helper function to get all categories for UI
export const getCategoriesForUI = () => {
  return Object.entries(ITEM_TYPES_CONFIG).map(([key, config]) => ({
    id: config.value,
    name: config.displayName,
    icon: config.icon,
    description: config.description
  }));
};

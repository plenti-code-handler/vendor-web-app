/**
 * Catalogue / pricing utility functions and constants.
 */

import { ALL_ITEM_TYPES } from '../constants/itemTypes';

// Max number of pricing entries per item type
export const PRICING_LIMITS_BY_ITEM_TYPE = {
  MEAL: 3,
  BAKED_GOODS: 3,
  SNACKS_AND_DESSERT: 4,
};

export const PRICING_LIMIT_REACHED_MESSAGE =
  'The pricing limit has already been reached. Please contact support to add more.';

/** @returns {number} Max pricing entries allowed for the given item type (default 3 if unknown). */
export const getPricingLimit = (itemType) => {
  const limit = PRICING_LIMITS_BY_ITEM_TYPE[itemType];
  return typeof limit === 'number' ? limit : 3;
};

/** @returns {boolean} True if another pricing entry can be added for this item type. */
export const canAddPricing = (itemType, currentCount) => {
  const limit = getPricingLimit(itemType);
  return currentCount < limit;
};

/** Stable key for a pricing entry (item_type + id). */
export const entryKey = (e) => `${e.item_type}:${e.id ?? 'default'}`;

/** Filter pricing array to entries for a single item type. */
export const getEntriesForItemType = (pricing, itemType) => {
  if (!Array.isArray(pricing)) return [];
  return pricing.filter((p) => String(p.item_type) === String(itemType));
};

/** Item types that have at least one pricing entry with non-empty bags. */
export const getAvailableCategories = (pricing) => {
  if (!Array.isArray(pricing)) return [];
  const hasBags = (entry) => entry?.bags && Object.keys(entry.bags).length > 0;
  const itemTypesWithBags = [...new Set(
    pricing.filter(hasBags).map((p) => String(p.item_type))
  )];
  return ALL_ITEM_TYPES.filter((itemType) => itemTypesWithBags.includes(itemType));
};

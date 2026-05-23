/**
 * Catalogue / pricing utility functions and constants.
 */

import { catalogue_limits } from '../constants/catalogue';
import { ALL_ITEM_TYPES } from '../constants/itemTypes';


export const PRICING_LIMIT_REACHED_MESSAGE =
  'The pricing limit has already been reached. Please contact support to add more.';

/** @returns {number} Max pricing entries allowed for the given item type (default 3 if unknown). */
export const getPricingLimit = (itemType, vendorId) => {
  const itemTypeLimits = catalogue_limits[itemType];
  if (!itemTypeLimits) return 3;

  if (vendorId && typeof itemTypeLimits[vendorId] === 'number') {
    return itemTypeLimits[vendorId];
  }

  return typeof itemTypeLimits.default === 'number' ? itemTypeLimits.default : 3;
};

/** @returns {boolean} True if another pricing entry can be added for this item type. */
export const canAddPricing = (itemType, currentCount, vendorId) => {
  const limit = getPricingLimit(itemType, vendorId);
  return currentCount < limit;
};

/** Stable key for a pricing entry (item_type + id). */
export const entryKey = (e) => `${e.item_type}:${e.id ?? 'default'}`;

/** Filter pricing array to entries for a single item type. */
export const getEntriesForItemType = (pricing, itemType) => {
  if (!Array.isArray(pricing)) return [];
  return pricing.filter((p) => String(p.item_type) === String(itemType));
};

const normalizePricingEntry = (entry) => {
  const bags = entry?.bags ?? {};
  const cuts = entry?.cuts ?? {};
  return {
    item_type: String(entry.item_type),
    id: String(entry.id ?? 'default'),
    name: String(entry.name ?? ''),
    asp: Number(entry.asp),
    bags: {
      SMALL: bags.SMALL != null ? Number(bags.SMALL) : null,
      MEDIUM: bags.MEDIUM != null ? Number(bags.MEDIUM) : null,
      LARGE: bags.LARGE != null ? Number(bags.LARGE) : null,
    },
    cuts: {
      SMALL: Number(cuts.SMALL ?? 0),
      MEDIUM: Number(cuts.MEDIUM ?? 0),
      LARGE: Number(cuts.LARGE ?? 0),
    },
    descriptions: [...(entry.descriptions || [])].map(String).sort(),
  };
};

/** True when local draft pricing differs from the catalogue fetched from the backend. */
export const hasPricingCatalogueChanges = (localPricing, serverPricing) => {
  const normalizeList = (list) =>
    (list || [])
      .map(normalizePricingEntry)
      .sort((a, b) => entryKey(a).localeCompare(entryKey(b)));

  return JSON.stringify(normalizeList(localPricing)) !== JSON.stringify(normalizeList(serverPricing));
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

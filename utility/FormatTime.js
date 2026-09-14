// vendor-web-app/utility/FormatTime.js
import {
  safeToLocaleDateString,
  safeToLocaleString,
  safeToLocaleTimeString,
} from "./intlSafe";

export const formatTime = (time) => {
  if (!time) return "N/A";
  const date = new Date(time * 1000);
  return (
    safeToLocaleTimeString(date, "en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata", // IST timezone
    }) || "N/A"
  );
};

// Add a new function for full date and time in IST
export const formatDateTime = (timestamp) => {
  if (!timestamp) return "N/A";
  const date = new Date(timestamp * 1000);
  return (
    safeToLocaleString(date, "en-IN", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    }) || "N/A"
  );
};

/**
 * Formats Unix timestamp to date only in Indian Standard Time
 * @param {number} timestamp - Unix timestamp in seconds
 * @returns {string} Formatted date string (e.g., "11/08/2025")
 */
export const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);

  return (
    safeToLocaleDateString(date, "en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    }) || "N/A"
  );
};

/**
 * Calculates number of days ago from a unix timestamp
 * @param {number} timestamp - Unix timestamp in seconds
 * @returns {string} Relative time string (e.g., "Today", "Yesterday", or "x days ago")
 */
export const getRecency = (timestamp) => {
  if (!timestamp) return "N/A";

  const date = new Date(timestamp * 1000);
  const now = new Date();

  // Reset time part to compare dates only
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const diffTime = today - targetDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays > 1) {
    return `${diffDays} days ago`;
  } else {
    // Future dates or other cases, fallback to date string
    return (
      safeToLocaleDateString(date, "en-IN", {
        month: "short",
        day: "numeric",
      }) || "N/A"
    );
  }
};

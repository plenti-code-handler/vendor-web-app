import { Timestamp } from "firebase/firestore";

export const convertDateToTimestamp = (date) => {
  if (!(date instanceof Date)) {
    throw new TypeError("The input must be a Date object");
  }

  // Convert date to milliseconds
  const milliseconds = date.getTime();

  // Extract seconds and nanoseconds
  const seconds = Math.floor(milliseconds / 1000);
  const nanoseconds = (milliseconds % 1000) * 1000000;

  return {
    seconds,
    nanoseconds,
  };
};

export const formatDateTime = (date) => {
  // Define options for date and time formatting
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
    timeZone: "Asia/Karachi", // UTC+5
  };

  // Format the date according to the specified options
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);

  // Add the 'UTC+5' part manually
  return `${formattedDate} UTC+5`;
};

export function convertTimestampToDDMMYYYY(timestamp) {
  if (typeof timestamp !== "object" || timestamp === null) {
    throw new TypeError(
      "The input must be an object with seconds and nanoseconds properties"
    );
  }

  const { seconds, nanoseconds } = timestamp;

  if (typeof seconds !== "number" || typeof nanoseconds !== "number") {
    throw new TypeError(
      "The timestamp object must contain numeric seconds and nanoseconds properties"
    );
  }

  // Convert timestamp to milliseconds
  const milliseconds = seconds * 1000 + nanoseconds / 1000000;

  // Create a Date object
  const date = new Date(milliseconds);

  // Extract day, month, and year
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const year = date.getFullYear();

  // Format as DD/MM/YYYY
  return `${day}/${month}/${year}`;
}

export const handleDate = (date) => {
  if (!(date instanceof Date)) {
    throw new TypeError("The input must be a Date object");
  }

  // Convert date to milliseconds
  const milliseconds = date.getTime();

  // Convert milliseconds to Firebase Timestamp
  const seconds = Math.floor(milliseconds / 1000);
  const nanoseconds = (milliseconds % 1000) * 1000000;

  return new Timestamp(seconds, nanoseconds);
};

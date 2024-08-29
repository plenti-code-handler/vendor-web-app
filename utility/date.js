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

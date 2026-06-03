export const ORDER_STATUS_CONFIG = {
  CREATED: { color: "bg-[#7e45ee]", label: "Created" },
  WAITING_FOR_PICKUP: { color: "bg-indigo-500", label: "Waiting For Pickup" },
  READY_FOR_PICKUP: { color: "bg-yellow-500", label: "Ready For Pickup" },
  PICKED_UP: { color: "bg-green-500", label: "Picked Up" },
  CANCELLED: { color: "bg-red-500", label: "Cancelled" },
  NOT_PICKED_UP: { color: "bg-orange-500", label: "Not Picked Up" },
};

export const normalizeOrderStatus = (rawStatus) => {
  if (!rawStatus) return null;
  return rawStatus.replace("order.", "").toUpperCase();
};

export const getOrderStatusDisplay = (rawStatus) => {
  if (!rawStatus) {
    return { color: "bg-gray-400", label: "Not Available" };
  }

  const status = normalizeOrderStatus(rawStatus);
  return (
    ORDER_STATUS_CONFIG[status] || {
      color: "bg-blue-500",
      label: status
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (l) => l.toUpperCase()),
    }
  );
};

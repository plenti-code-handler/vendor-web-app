import { getOrderStatusDisplay } from "../../constants/orderStatus";

const OrderStatusBadge = ({ status, className = "" }) => {

  const { color, label } = getOrderStatusDisplay(status);

  return (
    <span
      className={`inline-block px-2 py-1 rounded text-white text-xs font-semibold ${color} ${className}`.trim()}
    >
      {label}
    </span>
  );
};

export default OrderStatusBadge;

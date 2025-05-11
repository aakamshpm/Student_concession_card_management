import { FiAlertCircle, FiCheck, FiClock, FiX } from "react-icons/fi";

const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: {
      color: "bg-yellow-100 text-yellow-800",
      icon: <FiClock className="mr-1" />,
    },
    approved: {
      color: "bg-green-100 text-green-800",
      icon: <FiCheck className="mr-1" />,
    },
    rejected: {
      color: "bg-red-100 text-red-800",
      icon: <FiX className="mr-1" />,
    },
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
        statusConfig[status]?.color || "bg-gray-100 text-gray-800"
      }`}
    >
      {statusConfig[status]?.icon || <FiAlertCircle className="mr-1" />}
      {status}
    </span>
  );
};

export default StatusBadge;

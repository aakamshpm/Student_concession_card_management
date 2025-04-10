const InfoRow = ({ label, value, icon }) => (
  <div className="flex">
    <div className="w-32 text-gray-500 flex items-center">
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </div>
    <div className="font-medium">{value}</div>
  </div>
);

export default InfoRow;

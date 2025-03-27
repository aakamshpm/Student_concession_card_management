import { useGetStudentDataQuery } from "../slices/studentsApiSlice";

const Status = () => {
  const { data: studentData } = useGetStudentDataQuery();

  const formatDate = (isoString) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    if (!status) return "-";

    const statusClasses = {
      approved: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      rejected: "bg-red-100 text-red-800",
      verified: "bg-blue-100 text-blue-800",
      default: "bg-gray-100 text-gray-800",
    };

    const statusKey = status.toLowerCase();
    const className = statusClasses[statusKey] || statusClasses.default;

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${className}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="flex flex-col mt-7">
      <h2 className="text-3xl font-semibold font-[Volkhov]">
        Application Status
      </h2>
      <div className="bg-white rounded-lg shadow-md mt-3 p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Field
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ID Verification
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {getStatusBadge(studentData?.eligibility?.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(studentData?.eligibility?.appliedDate) || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(studentData?.eligibility?.lastUpdated) || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {studentData?.eligibility?.reason || "-"}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Application
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {getStatusBadge(studentData?.application?.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(studentData?.application?.appliedDate) || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(studentData?.application?.lastUpdated) || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {studentData?.application?.reason || "-"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* <div className="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-lg font-medium text-blue-800 mb-2">
          Status Legend
        </h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            <span className="text-sm text-gray-600">Approved</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
            <span className="text-sm text-gray-600">Pending</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
            <span className="text-sm text-gray-600">Rejected</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
            <span className="text-sm text-gray-600">Verified</span>
          </div>
        </div>
      </div> */}
      </div>
    </div>
  );
};

export default Status;

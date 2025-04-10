import {
  FiCheckCircle,
  FiDownload,
  FiPrinter,
  FiFilter,
  FiSearch,
} from "react-icons/fi";
import { useState } from "react";

const ApprovedApplications = () => {
  const [timeRange, setTimeRange] = useState("month");
  const [searchTerm, setSearchTerm] = useState("");

  // Sample data - replace with API data
  const approvedApplications = [
    {
      id: "APP001",
      studentId: "STU001",
      studentName: "Rahul Sharma",
      institution: "Delhi Public School",
      approvedDate: "2023-06-15T10:30:00Z",
      expiryDate: "2024-06-14T23:59:59Z",
      routes: [
        { startingPoint: "HOME", destination: "SCHOOL" },
        { startingPoint: "SCHOOL", destination: "LIBRARY" },
      ],
    },
    {
      id: "APP002",
      studentId: "STU002",
      studentName: "Priya Patel",
      institution: "Mumbai University",
      approvedDate: "2023-06-18T14:45:00Z",
      expiryDate: "2024-06-17T23:59:59Z",
      routes: [{ startingPoint: "HOSTEL", destination: "CAMPUS" }],
    },
  ];

  const filteredApplications = approvedApplications.filter(
    (app) =>
      app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6 w-full">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold font-['Volkhov'] text-primary-color mb-2">
                Approved Applications
              </h1>
              <p className="text-gray-600">
                View all issued student concession cards
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                <FiDownload className="text-gray-500" />
                Export
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                <FiPrinter className="text-gray-500" />
                Print
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2">
              <FiSearch className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search applications..."
                className="bg-transparent w-full focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <FiFilter className="text-gray-400" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-gray-50 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-color focus:border-primary-color"
              >
                <option value="week">Last 7 days</option>
                <option value="month">Last 30 days</option>
                <option value="quarter">Last 3 months</option>
                <option value="year">Last 12 months</option>
                <option value="all">All time</option>
              </select>
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          {/* Table Header */}
          <div className="grid grid-cols-12 bg-gray-50 px-6 py-3 border-b border-gray-200 font-medium text-gray-500 text-sm uppercase tracking-wider">
            <div className="col-span-2">Application ID</div>
            <div className="col-span-3">Student</div>
            <div className="col-span-3">Institution</div>
            <div className="col-span-2">Approved Date</div>
            <div className="col-span-2">Expiry Date</div>
          </div>

          {/* Application Rows */}
          {filteredApplications.length > 0 ? (
            filteredApplications.map((app) => (
              <div
                key={app.id}
                className="grid grid-cols-12 items-center px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <div className="col-span-2 font-medium text-primary-color">
                  {app.id}
                </div>
                <div className="col-span-3">
                  <p className="font-medium">{app.studentName}</p>
                  <p className="text-sm text-gray-500">ID: {app.studentId}</p>
                </div>
                <div className="col-span-3 text-gray-600">
                  {app.institution}
                </div>
                <div className="col-span-2 text-gray-600">
                  {formatDate(app.approvedDate)}
                </div>
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">
                      {formatDate(app.expiryDate)}
                    </span>
                    <FiCheckCircle className="text-green-500" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              No approved applications found
            </div>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-gray-500 text-sm font-medium mb-1">
              Total Approved
            </h3>
            <p className="text-2xl font-bold">1,248</p>
            <p className="text-green-500 text-sm mt-1">↑ 12% from last month</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-gray-500 text-sm font-medium mb-1">
              Expiring Soon
            </h3>
            <p className="text-2xl font-bold">42</p>
            <p className="text-yellow-500 text-sm mt-1">Within next 30 days</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-gray-500 text-sm font-medium mb-1">
              Avg. Processing Time
            </h3>
            <p className="text-2xl font-bold">2.4 days</p>
            <p className="text-blue-500 text-sm mt-1">Improved by 18%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovedApplications;

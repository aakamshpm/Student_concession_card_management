import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiUser,
  FiMail,
  FiPhone,
  FiChevronRight,
} from "react-icons/fi";
import { useGetAllStudentsQuery } from "../../slices/adminApiSlice";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";

const Students = () => {
  const { data, isLoading, isError, isFetching, isSuccess, error } =
    useGetAllStudentsQuery();

  const [students, setStudents] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = students?.filter(
    (student) =>
      `${student.firstName} ${student.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.institutionDetails.institutionName
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (data) {
      setStudents(data?.data);
    }
  }, [isFetching]);

  console.log(students);

  if (isLoading && !data) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorMessage error={error} />;
  }

  if (isSuccess) {
    return (
      <div className="bg-gray-50 w-full min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold font-['Volkhov'] text-primary-color mb-2">
              Student Management
            </h1>
            <p className="text-gray-600">
              View and manage all registered student accounts
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-200">
            <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2">
              <FiSearch className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search students by name, email or institution..."
                className="bg-transparent w-full focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Students Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            {/* Table Header */}
            <div className="grid grid-cols-12 bg-gray-50 px-6 py-3 border-b border-gray-200 font-medium text-gray-500 text-sm uppercase tracking-wider">
              <div className="col-span-3">Student</div>
              <div className="col-span-3">Contact</div>
              <div className="col-span-4">Institution</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1"></div>
            </div>

            {/* Student Rows */}
            {filteredStudents.map((student) => (
              <Link
                to={`/student/${student._id}`}
                key={student._id}
                className="grid grid-cols-12 items-center px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <div className="col-span-3 flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary-color/10 flex items-center justify-center mr-3">
                    {student?.studentPhoto ? (
                      <img
                        src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${
                          student.studentPhoto
                        }`}
                        alt="Student"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <FiUser className="text-primary-color" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">
                      {student.firstName} {student.lastName}
                    </p>
                    <p className="text-sm text-gray-500">ID: {student._id}</p>
                  </div>
                </div>

                <div className="col-span-3">
                  <div className="flex items-center text-gray-600 mb-1">
                    <FiMail className="mr-2" />
                    <span className="truncate">{student.email}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiPhone className="mr-2" />
                    <span>{student.mobile}</span>
                  </div>
                </div>

                <div className="col-span-4 text-gray-600">
                  {student.institutionDetails.institutionName}
                </div>

                <div className="col-span-1">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      student.application.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {student.application.status}
                  </span>
                </div>

                <div className="col-span-1 flex justify-end">
                  <FiChevronRight className="text-gray-400" />
                </div>
              </Link>
            ))}

            {filteredStudents.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No students found matching your search
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
};

export default Students;

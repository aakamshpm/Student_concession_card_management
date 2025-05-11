import { useEffect, useState } from "react";
import {
  FiSearch,
  FiUser,
  FiCheck,
  FiClock,
  FiX,
  FiAlertCircle,
} from "react-icons/fi";
import {
  useGetAppliedForVerificationStudentsQuery,
  useVerifyStudentMutation,
} from "../../slices/adminApiSlice";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import VerificationModal from "../../components/VerificationModal";
import { enqueueSnackbar } from "notistack";
import StatusBadge from "../../components/StatusBadge";

const Verifications = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, refetch, isLoading, isError, error } =
    useGetAppliedForVerificationStudentsQuery();

  const [verifyStudent] = useVerifyStudentMutation();
  const [isVerifying, setIsVerifying] = useState(false);

  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const filteredStudents = students?.filter(
    (student) =>
      `${student.firstName} ${student.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.institutionDetails?.institutionName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (data?.data) {
      setStudents(data?.data);
    }
  }, [data, isLoading]);

  useEffect(() => {
    refetch();
  }, [selectedStudent]);

  const handleVerification = async (id, decision, reason) => {
    if (!id || !decision) {
      enqueueSnackbar("Required Fields are missing!", {
        variant: "error",
      });
      return;
    }

    if (decision === "rejected" && !reason) {
      enqueueSnackbar("Please provide a reason for rejection!", {
        variant: "error",
      });
      return;
    }

    try {
      setIsVerifying(true);
      const response = await verifyStudent({
        studentId: id,
        decision,
        reason,
      }).unwrap();
      enqueueSnackbar(response.data?.message || "Verification Done!", {
        variant: "success",
      });

      setSelectedStudent(null);
    } catch (error) {
      enqueueSnackbar(
        error.data?.message || error?.message || "Something went wrong",
        {
          variant: "error",
        }
      );
    } finally {
      setIsVerifying(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorMessage error={error} />;
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6 w-full">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold font-['Volkhov'] text-primary-color mb-2">
            Student Verifications
          </h1>
          <p className="text-gray-600">
            Review and verify student eligibility applications
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
            <div className="col-span-4">Student</div>
            <div className="col-span-3">Institution</div>
            <div className="col-span-2">Applied Date</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1">Actions</div>
          </div>

          {/* Student Rows */}
          {filteredStudents?.length > 0 ? (
            filteredStudents.map((student) => (
              <div
                key={student._id}
                className="grid grid-cols-12 items-center px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <div className="col-span-4 flex items-center">
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
                    <p className="text-sm text-gray-500">{student.email}</p>
                  </div>
                </div>

                <div className="col-span-3 text-gray-600">
                  {student.institutionDetails?.institutionName ||
                    "Not provided"}
                </div>

                <div className="col-span-2 text-gray-600">
                  {new Date(
                    student.eligibility?.appliedDate
                  ).toLocaleDateString()}
                </div>

                <div className="col-span-2">
                  <StatusBadge status={student.eligibility?.status} />
                </div>

                <div className="col-span-1 flex">
                  <button
                    onClick={() => {
                      setSelectedStudent(student);
                    }}
                    className="text-primary-color hover:text-primary-dark transition-colors"
                  >
                    Review
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              {searchTerm
                ? "No matching students found"
                : "No pending verification requests"}
            </div>
          )}
        </div>
        {selectedStudent && (
          <VerificationModal
            student={selectedStudent}
            onClose={() => setSelectedStudent(null)}
            handleVerification={handleVerification}
            isVerifying={isVerifying}
          />
        )}
      </div>
    </div>
  );
};

export default Verifications;

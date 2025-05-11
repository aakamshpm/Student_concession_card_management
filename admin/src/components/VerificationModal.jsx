import { useState } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiHome,
  FiBook,
  FiX,
  FiMapPin,
} from "react-icons/fi";
import { FaBirthdayCake } from "react-icons/fa";
import InfoRow from "./InfoRow";

const VerificationModal = ({
  student,
  onClose,
  handleVerification,
  isVerifying,
}) => {
  console.log(student);
  const [reason, setReason] = useState("");
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold font-['Volkhov'] text-primary-color">
            Verify Student Eligibility
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
          {/* Student Details Column */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-full bg-primary-color/10 flex items-center justify-center">
                {student.studentPhoto ? (
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${
                      student.studentPhoto
                    }`}
                    alt="Student"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <FiUser className="text-primary-color text-2xl" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold">
                  {student.firstName} {student.lastName}
                </h3>
                <p className="text-gray-500">ID: {student._id}</p>
                <p className="text-gray-500">
                  Applied on:{" "}
                  {new Date(
                    student.eligibility?.appliedDate
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                  <FiUser className="mr-2 text-primary-color" />
                  Personal Information
                </h4>
                <div className="space-y-2">
                  <InfoRow
                    icon={<FiMail />}
                    label="Email"
                    value={student.email}
                  />
                  <InfoRow
                    icon={<FaBirthdayCake />}
                    label="Date of Birth"
                    value={`${
                      new Date(student.dateOfBirth).toLocaleDateString() || ""
                    }
                    `}
                  />
                  <InfoRow
                    icon={<FiPhone />}
                    label="Phone"
                    value={student.mobile}
                  />
                  <InfoRow
                    icon={<FiHome />}
                    label="Address"
                    value={`${student.address?.houseName || ""}, ${
                      student.address?.houseCity || ""
                    }`}
                  />
                  <InfoRow
                    icon={<FiMapPin />}
                    label="Pincode"
                    value={`${student.address?.housePincode || ""}
                    `}
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                  <FiBook className="mr-2 text-primary-color" />
                  Institution Details
                </h4>
                <div className="space-y-2">
                  <InfoRow
                    label="Institution"
                    value={student.institutionDetails?.institutionName}
                  />
                  <InfoRow
                    label="Course"
                    value={`${
                      student.institutionDetails?.course?.courseName || ""
                    } 
                    `}
                  />
                  <InfoRow
                    label="Current Year"
                    value={`${
                      student.institutionDetails?.course?.currentYear || ""
                    }`}
                  />
                  <InfoRow
                    label="Course Duration"
                    value={
                      `${student.institutionDetails?.course?.courseDuration}` ||
                      ""
                    }
                  />
                  <InfoRow
                    label="Address"
                    value={`${
                      student.institutionDetails?.institutionStreet || ""
                    }, 
                    ${student.institutionDetails?.institutionCity || ""},
                    ${student.institutionDetails?.institutionPincode || ""}
                    ,
                    `}
                  />
                  <InfoRow
                    label="Pincode"
                    value={`${
                      student.institutionDetails?.institutionPincode || ""
                    }
                    `}
                  />
                  <InfoRow
                    label="Phone"
                    value={`${
                      student.institutionDetails?.institutionPhone || ""
                    }
                    `}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ID Verification Column */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-3">
                Student ID Card
              </h4>
              {student.studentIdCard ? (
                <div className="flex flex-col items-center">
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${
                      student.studentIdCard
                    }`}
                    alt="Student ID Card"
                    className="max-w-full h-auto rounded-md border border-gray-200 mb-3 max-h-64"
                  />
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No ID card uploaded
                </p>
              )}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-3">
                Verification Notes
              </h4>
              <textarea
                className="w-full border border-gray-300 rounded-md p-3 focus:ring-primary-color focus:border-primary-color"
                rows="4"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Add any verification notes or reasons for rejection..."
              ></textarea>
            </div>

            {/* Verification Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() =>
                  handleVerification(student._id, "rejected", reason)
                }
                disabled={isVerifying}
                className={`px-4 py-2 border border-red-600 rounded-md transition-colors flex items-center justify-center gap-2 ${
                  isVerifying
                    ? "bg-red-50 text-red-600 cursor-not-allowed"
                    : "text-red-600 hover:bg-red-50"
                }`}
              >
                {isVerifying ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Rejecting...
                  </>
                ) : (
                  "Reject Verification"
                )}
              </button>
              <button
                disabled={isVerifying}
                onClick={() =>
                  handleVerification(student._id, "approved", reason)
                }
                className={`px-4 py-2 rounded-md transition-colors flex items-center justify-center gap-2 ${
                  isVerifying
                    ? "bg-primary-color/70 cursor-not-allowed"
                    : "bg-primary-color hover:bg-primary-dark"
                } text-white`}
              >
                {isVerifying ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Approving...
                  </>
                ) : (
                  "Approve Verification"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationModal;

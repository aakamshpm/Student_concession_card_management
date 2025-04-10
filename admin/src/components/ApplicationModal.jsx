import {
  FiUser,
  FiMail,
  FiPhone,
  FiHome,
  FiBook,
  FiMapPin,
  FiX,
} from "react-icons/fi";
import StatusBadge from "./StatusBadge";
import InfoRow from "./InfoRow";
import { useState } from "react";

const ApplicationModal = ({
  student,
  onClose,
  onHandleApplication,
  isApprovingApplication,
  isRejectingApplication,
  isHandlingApplication,
}) => {
  const [decisionReason, setDecisionReason] = useState("");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold font-['Volkhov'] text-primary-color">
              Concession Card Application
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Student ID: {student._id}
            </p>
          </div>
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
            {/* Verification Status */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-3">
                Verification Status
              </h4>
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Eligibility</p>
                  <StatusBadge status={student.eligibility.status} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Application</p>
                  <StatusBadge status={student.application.status} />
                </div>
              </div>
            </div>

            {/* Personal Information */}
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
              </div>
            </div>

            {/* Institution Details */}
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
                  (Year ${
                    student.institutionDetails?.course?.currentYear || ""
                  })`}
                />
                <InfoRow
                  label="Address"
                  value={`${
                    student.institutionDetails?.institutionStreet || ""
                  }, 
                  ${student.institutionDetails?.institutionCity || ""}`}
                />
              </div>
            </div>
          </div>

          {/* Application Details Column */}
          <div className="space-y-6">
            {/* Travel Routes */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                <FiMapPin className="mr-2 text-primary-color" />
                Applied Routes ({student.routes?.length || 0})
              </h4>
              <div className="space-y-3">
                {student.routes?.length > 0 ? (
                  student.routes.map((route, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-white p-3 rounded-md border border-gray-200"
                    >
                      <span className="w-6 h-6 rounded-full bg-primary-color/10 text-primary-color flex items-center justify-center text-xs font-medium mr-3">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium">
                          {route.startingPoint} → {route.destination}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No routes specified
                  </p>
                )}
              </div>
            </div>

            {/* Application Timeline */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-3">
                Application Timeline
              </h4>
              <div className="space-y-2">
                <InfoRow
                  label="Applied On"
                  value={new Date(
                    student.application.appliedDate
                  ).toLocaleString()}
                />
                <InfoRow
                  label="Last Updated"
                  value={new Date(
                    student.application.lastUpdated
                  ).toLocaleString()}
                />
                {student.application.reason && (
                  <InfoRow
                    label="Previous Remarks"
                    value={student.application.reason}
                  />
                )}
              </div>
            </div>

            {/* Decision Section */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-3">Decision</h4>
              <textarea
                value={decisionReason}
                onChange={(e) => setDecisionReason(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-3 mb-4 focus:ring-primary-color focus:border-primary-color"
                rows="3"
                placeholder="Enter approval remarks or reason for rejection..."
              ></textarea>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() =>
                    onHandleApplication(student._id, "rejected", decisionReason)
                  }
                  disabled={isHandlingApplication}
                  className={`px-4 py-2 border border-red-600 rounded-md transition-colors flex items-center justify-center gap-2 ${
                    isHandlingApplication
                      ? "bg-red-50 text-red-600 cursor-not-allowed"
                      : "text-red-600 hover:bg-red-50"
                  }`}
                >
                  {isRejectingApplication ? (
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
                    "Reject Application"
                  )}
                </button>
                <button
                  disabled={isHandlingApplication}
                  onClick={() =>
                    onHandleApplication(student._id, "approved", decisionReason)
                  }
                  className={`px-4 py-2 rounded-md transition-colors flex items-center justify-center gap-2 ${
                    isHandlingApplication
                      ? "bg-primary-color/70 cursor-not-allowed"
                      : "bg-primary-color hover:bg-primary-dark"
                  } text-white`}
                >
                  {isApprovingApplication ? (
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
                    "Approve Application"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationModal;

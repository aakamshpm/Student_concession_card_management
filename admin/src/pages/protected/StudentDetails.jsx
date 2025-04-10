import {
  FiBook,
  FiCalendar,
  FiCheck,
  FiClock,
  FiHome,
  FiMail,
  FiMapPin,
  FiPhone,
  FiUser,
  FiX,
} from "react-icons/fi";
import { useParams } from "react-router-dom";
import { useGetStudentByIdQuery } from "../../slices/adminApiSlice";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import { useEffect, useState } from "react";
import InfoRow from "../../components/InfoRow";

const StudentDetail = () => {
  const { id } = useParams();
  const { data, isLoading, isFetching, isError, isSuccess, error } =
    useGetStudentByIdQuery(id);

  const [student, setStudent] = useState({});

  useEffect(() => {
    if (data?.data) {
      setStudent(data?.data);
    }
  }, [data]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      false: {
        color: "bg-gray-100 text-gray-800",
        icon: <FiClock className="mr-1" />,
      },
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
      withdrawn: {
        color: "bg-purple-100 text-purple-800",
        icon: <FiX className="mr-1" />,
      },
    };

    const config = statusConfig[status] || statusConfig.false;

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.icon}
        {status === "false" ? "Not Applied" : status}
      </span>
    );
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorMessage error={error} />;
  }

  if (isSuccess) {
  }
  return (
    <div className="bg-gray-50 min-h-screen p-6 w-full">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm p-8 border border-gray-200">
        {/* Student Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4">
          <div className="flex items-start">
            <div className="w-20 h-20 rounded-full bg-primary-color/10 flex items-center justify-center mr-4">
              {student.studentPhoto ? (
                <img
                  src={student.studentPhoto}
                  alt="Student"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <FiUser className="text-primary-color text-3xl" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold font-['Volkhov']">
                {student.firstName} {student.lastName}
              </h1>
              <p className="text-gray-500 mb-1">ID: {student._id}</p>
              <p className="text-gray-500">
                Date of Birth: {formatDate(student.dateOfBirth)}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div>
              <span className="text-sm font-medium text-gray-500 mr-2">
                Concession Status:
              </span>
              <StatusBadge status={student?.application?.status} />
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500 mr-2">
                Verification:
              </span>
              <StatusBadge status={student?.eligibility?.status} />
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information Card */}
          <div className="bg-gray-50 p-5 rounded-lg">
            <h2 className="font-medium text-lg mb-4 flex items-center">
              <FiUser className="mr-2 text-primary-color" />
              Personal Information
            </h2>
            <div className="space-y-3">
              <InfoRow label="Email" value={student.email} icon={<FiMail />} />
              <InfoRow
                label="Phone"
                value={student.mobile}
                icon={<FiPhone />}
              />
              <InfoRow
                label="Address"
                value={`${student.address?.houseName || ""}, 
                ${student.address?.houseStreet || ""}, 
                ${student.address?.houseCity || ""} - 
                ${student.address?.housePincode || ""}`}
                icon={<FiHome />}
              />
            </div>
          </div>

          {/* Institution Information Card */}
          <div className="bg-gray-50 p-5 rounded-lg">
            <h2 className="font-medium text-lg mb-4 flex items-center">
              <FiBook className="mr-2 text-primary-color" />
              Institution Details
            </h2>
            <div className="space-y-3">
              <InfoRow
                label="Institution"
                value={student.institutionDetails?.institutionName}
              />
              <InfoRow
                label="Address"
                value={`${student.institutionDetails?.institutionStreet || ""}, 
                ${student.institutionDetails?.institutionCity || ""} - 
                ${student.institutionDetails?.institutionPincode || ""}`}
                icon={<FiMapPin />}
              />
              <InfoRow
                label="Contact"
                value={student.institutionDetails?.institutionPhone}
              />
              <InfoRow
                label="Course"
                value={`${student.institutionDetails?.course?.courseName || ""} 
                (Year ${
                  student.institutionDetails?.course?.currentYear || ""
                } of 
                ${student.institutionDetails?.course?.courseDuration || ""})`}
              />
            </div>
          </div>

          {/* Application Details Card */}
          <div className="bg-gray-50 p-5 rounded-lg">
            <h2 className="font-medium text-lg mb-4 flex items-center">
              <FiCalendar className="mr-2 text-primary-color" />
              Application Details
            </h2>
            <div className="space-y-3">
              <InfoRow
                label="Applied On"
                value={formatDate(student?.application?.appliedDate)}
              />
              <InfoRow
                label="Last Updated"
                value={formatDate(student?.application?.lastUpdated)}
              />
              {student?.application?.reason && (
                <InfoRow label="Remarks" value={student?.application?.reason} />
              )}
              {student?.eligibility?.reason && (
                <InfoRow
                  label="Verification Notes"
                  value={student?.eligibility?.reason}
                />
              )}
            </div>
          </div>

          {/* Travel Routes Card */}
          {student.routes?.length > 0 && (
            <div className="bg-gray-50 p-5 rounded-lg">
              <h2 className="font-medium text-lg mb-4 flex items-center">
                <FiMapPin className="mr-2 text-primary-color" />
                Travel Routes
              </h2>
              <div className="space-y-3">
                {student.routes.map((route, index) => (
                  <div key={index} className="flex items-center">
                    <span className="w-6 h-6 rounded-full bg-primary-color/10 text-primary-color flex items-center justify-center text-xs font-medium mr-2">
                      {index + 1}
                    </span>
                    <span className="font-medium">
                      {route.startingPoint} → {route.destination}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Concession Card Details */}
          {student.concessionCard && (
            <div className="bg-gray-50 p-5 rounded-lg lg:col-span-2">
              <h2 className="font-medium text-lg mb-4 flex items-center">
                <FiCheck className="mr-2 text-primary-color" />
                Concession Card
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InfoRow
                  label="Issued Date"
                  value={formatDate(student.issuedDate)}
                />
                <InfoRow
                  label="Expiry Date"
                  value={formatDate(student.expiryDate)}
                />
              </div>
              {student.studentIdCard && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Student ID Card:
                  </p>
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${
                      student.studentIdCard
                    }`}
                    alt="Student ID"
                    className="max-w-full h-auto rounded-md border border-gray-200 max-h-40"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDetail;

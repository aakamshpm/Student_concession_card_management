import { Link, Navigate } from "react-router-dom";
import { FiDownload, FiArrowLeft } from "react-icons/fi";
import { useGetStudentDataQuery } from "../slices/studentsApiSlice";
import ConcessionCardViewer from "../components/ConcessionCardViewer";
import { enqueueSnackbar } from "notistack";

const ViewConcession = () => {
  const {
    data: studentData,
    isLoading: isStudentDataLoading,
    error: studentDataError,
  } = useGetStudentDataQuery();

  if (isStudentDataLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-color"></div>
      </div>
    );
  }

  if (studentDataError) {
    enqueueSnackbar("Failed to load student data", { variant: "error" });
    return <Navigate to="/" replace />;
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <Link
            to="/"
            className="flex items-center text-primary-color hover:text-primary-dark mr-4"
          >
            <FiArrowLeft className="mr-2" />
            Back to Home
          </Link>
        </div>

        {studentData.application?.status === "approved" ? (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold font-['Volkhov'] text-primary-color">
                Your Concession Card
              </h1>
              <button className="flex items-center px-4 py-2 bg-primary-color text-white rounded-md hover:bg-primary-dark transition-colors">
                <FiDownload className="mr-2" />
                Download PDF
              </button>
            </div>

            {/* PDF Viewer Container */}
            <div className="border-2 border-gray-200 rounded-lg bg-gray-50 min-h-[800px] flex flex-col items-center justify-center p-4">
              {/* Placeholder for PDF viewer - replace with actual PDF viewer component */}
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-primary-color/10 rounded-full flex items-center justify-center mb-4">
                  <FiDownload className="text-primary-color text-2xl" />
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-1">
                  Concession Card PDF
                </h3>
                <p className="text-gray-500 mb-4">
                  SC-2024-78945 | Expires: 15 June 2024
                </p>
                <p className="text-sm text-gray-400 mb-2">
                  Your concession card will appear here
                </p>
              </div>

              {/* <iframe
                src={studentData.concessionCardUrl}
                className="w-full h-full min-h-[500px]"
              /> */}
              {/* <ConcessionCardViewer url={studentData.concessionCardUrl} /> */}

              <iframe
                src={`${studentData.concessionCardUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                width="100%"
                height="1000px"
              />
            </div>

            {/* Important Information */}
            <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="font-medium text-blue-800 mb-2">Important:</h3>
              <ul className="text-sm text-blue-700 list-disc pl-5 space-y-1">
                <li>
                  Always carry your digital concession card when traveling
                </li>
                <li>Present this card to transport staff when requested</li>
                <li>
                  Ensure your device is charged when using the digital card
                </li>
                <li>Print a copy if you prefer physical verification</li>
              </ul>
            </div>
          </div>
        ) : studentData?.application?.status === "pending" ? (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Your student application is still under review. Please wait
                  for confirmation.
                  <Link
                    to="/status"
                    className="ml-1 font-medium text-yellow-700 hover:text-yellow-600 underline"
                  >
                    Check your status here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  You haven't completed your application yet.
                  <Link
                    to="/apply"
                    className="ml-1 font-medium text-blue-700 hover:text-blue-600 underline"
                  >
                    Click here to apply
                  </Link>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewConcession;

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsFillCloudUploadFill, BsCheckCircleFill } from "react-icons/bs";
import { FiEdit2 } from "react-icons/fi";
import { enqueueSnackbar } from "notistack";
import {
  useUploadIdCardMutation,
  useGetStudentDataQuery,
  useApplyForVerificationMutation,
} from "../slices/studentsApiSlice";

const Verify = () => {
  const [preview, setPreview] = useState(null);

  const {
    data: studentData,
    refetch,
    isLoading: isStudentDataLoading,
  } = useGetStudentDataQuery();

  const [uploadIdCard] = useUploadIdCardMutation();

  const [applyForVerification, { isLoading }] =
    useApplyForVerificationMutation();

  const navigate = useNavigate();

  const handleIdCardUpload = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      // Validate file type and size
      if (!file.type.match("image.*")) {
        throw new Error("Only image files are allowed");
      }
      if (file.size > 2 * 1024 * 1024) {
        // 2MB
        throw new Error("File size must be less than 2MB");
      }

      const formData = new FormData();
      formData.append("studentIdCard", file);
      const response = await uploadIdCard(formData).unwrap();
      setPreview(URL.createObjectURL(file));
      enqueueSnackbar(response?.message || "ID card uploaded successfully!", {
        variant: "success",
        autoHideDuration: 3000,
      });
    } catch (err) {
      enqueueSnackbar(err?.error || err?.data?.message || "Upload failed", {
        variant: "error",
        autoHideDuration: 4000,
      });
    }
  };

  const applyForIdVerification = async () => {
    try {
      if (!preview) {
        enqueueSnackbar("Please upload your ID card first", {
          variant: "warning",
        });
        return;
      }

      const response = await applyForVerification().unwrap();
      enqueueSnackbar(
        response?.message || "Verification submitted successfully!",
        {
          variant: "success",
          autoHideDuration: 3000,
        }
      );
      navigate("/status");
    } catch (error) {
      enqueueSnackbar(
        error?.error ||
          error?.data?.message ||
          "Verification submission failed",
        { variant: "error", autoHideDuration: 4000 }
      );
    }
  };

  useEffect(() => {
    refetch();
    if (!isStudentDataLoading && studentData?.studentIdCard) {
      setPreview(
        `${import.meta.env.VITE_API_SERVER_URL}/uploads/${
          studentData.studentIdCard
        }`
      );
    }
  }, [studentData, isStudentDataLoading, refetch]);

  if (isStudentDataLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-color"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold font-['Volkhov'] text-primary-color mb-2">
          Student Identity Verification
        </h1>
        <p className="text-gray-600">
          Verify your student status to apply for the bus concession card
        </p>

        {studentData?.eligibility?.status !== "false" && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md flex items-center">
            <BsCheckCircleFill className="text-blue-500 mr-2" />
            <span className="text-blue-700">
              {studentData?.eligibility?.status === "pending"
                ? "Verification pending approval"
                : "Verification already submitted"}
            </span>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Student Details Section */}
        <div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Student Information
              </h2>
              <Link
                to="/profile"
                className="text-primary-color hover:underline flex items-center text-sm"
              >
                <FiEdit2 className="mr-1" /> Edit
              </Link>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium">
                  {studentData?.firstName} {studentData?.lastName}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="font-medium">
                  {studentData?.dateOfBirth
                    ? new Date(studentData.dateOfBirth).toLocaleDateString()
                    : "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Contact Information</p>
                <p className="font-medium">{studentData?.email}</p>
                <p className="font-medium">{studentData?.mobile}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">
                  {studentData?.address?.houseName},{" "}
                  {studentData?.address?.houseStreet}
                </p>
                <p className="font-medium">
                  {studentData?.address?.houseCity},{" "}
                  {studentData?.address?.housePincode}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Institution Details
            </h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Institution Name</p>
                <p className="font-medium">
                  {studentData?.institutionDetails?.institutionName ||
                    "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">
                  {studentData?.institutionDetails?.institutionStreet},{" "}
                  {studentData?.institutionDetails?.institutionCity}
                </p>
                <p className="font-medium">
                  {studentData?.institutionDetails?.institutionPincode}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Course Information</p>
                <p className="font-medium">
                  {studentData?.institutionDetails?.course?.courseName} (Year{" "}
                  {studentData?.institutionDetails?.course?.currentYear} of{" "}
                  {studentData?.institutionDetails?.course?.courseDuration})
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-700 text-sm">
              <strong>Note:</strong> Ensure all details match exactly with your
              institution ID card. Incorrect information may delay verification.
            </p>
          </div>
        </div>

        {/* ID Upload Section */}
        <div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Upload Student ID Card
            </h2>

            <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-gray-300 rounded-lg mb-6">
              {preview ? (
                <div className="relative group">
                  <img
                    src={preview}
                    alt="ID Card Preview"
                    className="w-64 h-auto object-contain rounded-md shadow-sm"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <label
                      htmlFor="id-card"
                      className="bg-white p-2 rounded-full shadow-md cursor-pointer"
                    >
                      <BsFillCloudUploadFill className="text-primary-color" />
                    </label>
                  </div>
                </div>
              ) : (
                <>
                  <BsFillCloudUploadFill className="text-4xl text-gray-400 mb-3" />
                  <p className="text-gray-500 mb-2">
                    Upload your institution ID card
                  </p>
                  <p className="text-gray-400 text-sm mb-4">
                    JPG, PNG (Max 2MB)
                  </p>
                </>
              )}

              <label
                htmlFor="id-card"
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  preview
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    : "bg-primary-color text-white hover:bg-primary-dark"
                } transition-colors cursor-pointer`}
              >
                {preview ? "Change File" : "Select File"}
              </label>
              <input
                type="file"
                name="id-card"
                id="id-card"
                accept="image/*"
                className="hidden"
                onChange={handleIdCardUpload}
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mb-6">
              <h3 className="font-medium text-blue-800 mb-2">Requirements:</h3>
              <ul className="text-sm text-blue-700 list-disc pl-5 space-y-1">
                <li>Clear photo of your current student ID card</li>
                <li>All text must be readable</li>
                <li>Card must be valid for current academic year</li>
                <li>File size under 2MB</li>
              </ul>
            </div>

            <button
              onClick={applyForIdVerification}
              disabled={
                studentData?.eligibility?.status !== "false" ||
                isLoading ||
                !preview
              }
              className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
                studentData?.eligibility?.status !== "false" ||
                isLoading ||
                !preview
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-primary-color text-white hover:bg-primary-dark"
              } flex items-center justify-center`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  Processing...
                </>
              ) : (
                "Submit for Verification"
              )}
            </button>

            {studentData?.eligibility?.status !== "false" && (
              <p className="mt-3 text-sm text-gray-500 text-center">
                Verification status can be checked on your dashboard
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verify;

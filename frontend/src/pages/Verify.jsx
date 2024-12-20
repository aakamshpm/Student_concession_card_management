import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsFillCloudUploadFill, BsUiChecksGrid } from "react-icons/bs";
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

      const formData = new FormData();
      formData.append("studentIdCard", file);
      const response = await uploadIdCard(formData).unwrap();
      setPreview(URL.createObjectURL(file));
      enqueueSnackbar(response?.message, { variant: "success" });
    } catch (err) {
      enqueueSnackbar(err?.error || err?.data?.message, { variant: "error" });
    }
  };

  const applyForIdVerification = async () => {
    try {
      const response = await applyForVerification().unwrap();
      enqueueSnackbar(response?.message || "ID card uploaded successfully!", {
        variant: "success",
      });
      navigate("/apply");
    } catch (error) {
      enqueueSnackbar(
        error?.err ||
          error?.data?.message ||
          "Something went wrong. Please try again.",
        { variant: "error" }
      );
    }
  };

  useEffect(() => {
    refetch();
    if (!isStudentDataLoading && studentData?.studentIdCard)
      setPreview(`http://localhost:8000/uploads/${studentData.studentIdCard}`);
  }, [studentData]);

  if (isStudentDataLoading)
    return <p className="mt-5 ml-4 font-semibold">Loading...</p>;

  return (
    <div className="flex flex-col mt-5 w-max">
      <h2 className="font-[Volkhov] text-3xl font-semibold">
        Verify your student identity
      </h2>
      {studentData?.eligibility?.status !== "false" ? (
        <p className="mt-3 text-red-500">
          Student already applied for verification.
        </p>
      ) : (
        <></>
      )}
      <div className="grid grid-cols-2 gap-x-16 ">
        <div>
          <h3 className="text-lg mt-4">Student Details</h3>
          <section className="p-2 border-2 rounded-md border-red-400">
            <p>
              Name: {studentData?.firstName} {studentData?.lastName}
            </p>
            <p>
              Date of birth:{" "}
              {studentData?.dateOfBirth
                ? new Date(studentData.dateOfBirth).toISOString().split("T")[0]
                : "N/A"}
            </p>
            <p>Email: {studentData?.email}</p>
            <p>Mobile: {studentData?.mobile}</p>
            <p>
              Address: {studentData?.address?.houseName}{" "}
              {studentData?.address?.houseStreet}{" "}
              {studentData?.address?.houseCity}
            </p>
            <p>Pincode: {studentData?.address?.housePincode} </p>
          </section>
          <h3 className="text-lg mt-3">Institution Details</h3>
          <section className="p-2 border-2 rounded-md border-red-400">
            <p>Name: {studentData?.institutionDetails?.institutionName}</p>
            <p>Street: {studentData?.institutionDetails?.institutionStreet}</p>
            <p>City: {studentData?.institutionDetails?.institutionCity}</p>
            <p>
              Pincode: {studentData?.institutionDetails?.institutionPincode}
            </p>
            <p>Phone: {studentData?.institutionDetails?.institutionPhone}</p>
          </section>
          <h3 className="text-lg mt-3">Course Details</h3>
          <section className="p-2 border-2 rounded-md border-red-400">
            <p>Name: {studentData?.institutionDetails?.course?.courseName}</p>
            <p>
              Duration:{" "}
              {studentData?.institutionDetails?.course?.courseDuration}
            </p>
            <p>Year: {studentData?.institutionDetails?.course?.currentYear}</p>
          </section>
          <p className="text-red-600 mt-2">
            *Please ensure that the student details match with ID Card
          </p>
        </div>
        <div className="flex flex-col justify-start items-center w-max">
          <p className="text-lg mt-4">Upload your Institution Identity Card</p>
          {preview && (
            <div className="m-3">
              <img
                src={preview}
                alt="ID Card Preview"
                className="w-48 h-48 object-cover rounded shadow-md"
              />
            </div>
          )}
          <input
            type="file"
            name="id-card"
            id="id-card"
            accept="image/*"
            className="hidden"
            onChange={handleIdCardUpload}
          />
          <label
            htmlFor="id-card"
            className="cursor-pointer mt-3 transition-transform duration-200 hover:scale-110"
          >
            <BsFillCloudUploadFill size="2em" />
          </label>
          <p className="text-center">Upload</p>
        </div>
      </div>
      <button
        onClick={applyForIdVerification}
        className={`${isLoading ? "button-loading" : ""} self-end
          mt-2 bg-primary-color text-white font-medium p-3 rounded-md ${
            studentData?.eligibility?.status !== "false" &&
            "opacity-60 cursor-not-allowed"
          } ${
          studentData?.eligibility?.status === "false" &&
          " transition-transform duration-100 hover:scale-105"
        }`}
        disabled={studentData?.eligibility?.status !== "false"}
      >
        <p className="button-text">Apply for verification</p>
      </button>
    </div>
  );
};

export default Verify;

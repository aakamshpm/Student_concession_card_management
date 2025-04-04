import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import validator from "validator";
import {
  useGetStudentDataQuery,
  useUpdateMutation,
} from "../slices/studentsApiSlice";
import "react-phone-number-input/style.css";
import InputField from "../components/InputField";
import { FiSave, FiLoader } from "react-icons/fi";

const Profile = () => {
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    address: {
      houseName: "",
      houseStreet: "",
      houseCity: "",
      housePincode: "",
    },
    mobile: "",
    institutionDetails: {
      institutionName: "",
      course: {
        courseName: "",
        currentYear: "",
        courseDuration: "",
      },
      institutionStreet: "",
      institutionCity: "",
      institutionPincode: "",
      institutionPhone: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const {
    data: studentData,
    error,
    isLoading: isStudentDataLoading,
  } = useGetStudentDataQuery();
  const [update] = useUpdateMutation();

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (studentData) {
      const newData = {
        firstName: studentData?.firstName || "",
        lastName: studentData?.lastName || "",
        email: studentData?.email || "",
        dateOfBirth: studentData?.dateOfBirth
          ? new Date(studentData.dateOfBirth).toISOString().split("T")[0]
          : "",
        address: {
          houseName: studentData?.address?.houseName || "",
          houseCity: studentData?.address?.houseCity || "",
          houseStreet: studentData?.address?.houseStreet || "",
          housePincode: studentData?.address?.housePincode || "",
        },
        mobile: studentData?.mobile || "",
        institutionDetails: {
          institutionName:
            studentData?.institutionDetails?.institutionName || "",
          institutionStreet:
            studentData?.institutionDetails?.institutionStreet || "",
          institutionCity:
            studentData?.institutionDetails?.institutionCity || "",
          institutionPincode:
            studentData?.institutionDetails?.institutionPincode || "",
          institutionPhone:
            studentData?.institutionDetails?.institutionPhone || "",
          course: {
            courseName:
              studentData?.institutionDetails?.course?.courseName || "",
            currentYear:
              studentData?.institutionDetails?.course?.currentYear || "",
            courseDuration:
              studentData?.institutionDetails?.course?.courseDuration || "",
          },
        },
      };
      setProfileData(newData);
    }
  }, [studentData]);

  const onChangeHandler = (e) => {
    const { value, name } = e.target;
    setIsDirty(true);

    setProfileData((prev) => {
      if (name in prev.address) {
        return { ...prev, address: { ...prev.address, [name]: value } };
      }
      if (name in prev.institutionDetails) {
        return {
          ...prev,
          institutionDetails: { ...prev.institutionDetails, [name]: value },
        };
      }
      if (name in prev.institutionDetails.course) {
        return {
          ...prev,
          institutionDetails: {
            ...prev.institutionDetails,
            course: { ...prev.institutionDetails.course, [name]: value },
          },
        };
      }
      return { ...prev, [name]: value };
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!isDirty) {
      enqueueSnackbar("No changes to save", { variant: "info" });
      setIsLoading(false);
      return;
    }

    if (validateFormData()) {
      try {
        const res = await update(profileData).unwrap();
        enqueueSnackbar(res?.message || "Profile updated successfully!", {
          variant: "success",
          autoHideDuration: 3000,
        });
        setIsDirty(false);
      } catch (error) {
        enqueueSnackbar(
          error?.error || error?.data?.message || "Update failed",
          {
            variant: "error",
            autoHideDuration: 4000,
          }
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const validateFormData = () => {
    if (!profileData.mobile) profileData.mobile = "";
    else if (!isValidPhoneNumber(profileData.mobile)) {
      enqueueSnackbar("Please enter a valid mobile number", {
        variant: "error",
      });
      setIsLoading(false);
      return false;
    }

    if (!validator.isEmail(profileData.email)) {
      enqueueSnackbar("Please enter a valid email", { variant: "error" });
      setIsLoading(false);
      return false;
    }

    if (
      profileData.institutionDetails.institutionPhone &&
      !validator.isMobilePhone(profileData.institutionDetails.institutionPhone)
    ) {
      enqueueSnackbar("Please enter a valid institution phone", {
        variant: "error",
      });
      setIsLoading(false);
      return false;
    }

    return true;
  };

  const courseYearOption = Array.from(
    {
      length:
        parseInt(profileData.institutionDetails.course.courseDuration) || 0,
    },
    (_, index) => index + 1
  );

  if (error) {
    enqueueSnackbar(error?.data.message || "Failed to load profile data", {
      variant: "error",
    });
    navigate("/");
  }

  if (isStudentDataLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-color"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-['Volkhov'] text-primary-color">
          Student Profile
        </h1>
        <p className="text-gray-600 mt-2">
          Update your personal and institution details
        </p>
      </div>

      {/* Form Section */}
      <form
        onSubmit={onSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="grid md:grid-cols-2 gap-8">
          {/* Personal Information Column */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                Personal Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="First Name"
                  name="firstName"
                  type="text"
                  placeholder="First Name"
                  value={profileData.firstName}
                  onChangeHandler={onChangeHandler}
                  required
                />
                <InputField
                  label="Last Name"
                  name="lastName"
                  type="text"
                  placeholder="Last Name"
                  value={profileData.lastName}
                  onChangeHandler={onChangeHandler}
                  required
                />
              </div>
              <InputField
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={profileData.dateOfBirth}
                onChangeHandler={onChangeHandler}
                className="mt-4"
              />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                Contact Information
              </h2>
              <InputField
                label="Email"
                name="email"
                type="email"
                placeholder="student@example.com"
                value={profileData.email}
                onChangeHandler={onChangeHandler}
                required
              />
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number
                </label>
                <PhoneInput
                  defaultCountry="IN"
                  onChange={(value) => {
                    setIsDirty(true);
                    setProfileData((prev) => ({ ...prev, mobile: value }));
                  }}
                  value={profileData.mobile}
                  placeholder="Enter mobile number"
                  className="border border-gray-300 rounded-md p-2 w-full focus:ring-primary-color focus:border-primary-color"
                />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                Residential Address
              </h2>
              <div className="space-y-4">
                <InputField
                  label="House Name/Number"
                  name="houseName"
                  type="text"
                  placeholder="House name/number"
                  value={profileData.address.houseName}
                  onChangeHandler={onChangeHandler}
                />
                <InputField
                  label="Street"
                  name="houseStreet"
                  type="text"
                  placeholder="Street address"
                  value={profileData.address.houseStreet}
                  onChangeHandler={onChangeHandler}
                />
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="City"
                    name="houseCity"
                    type="text"
                    placeholder="City"
                    value={profileData.address.houseCity}
                    onChangeHandler={onChangeHandler}
                  />
                  <InputField
                    label="Pincode"
                    name="housePincode"
                    type="text"
                    placeholder="Pincode"
                    value={profileData.address.housePincode}
                    onChangeHandler={onChangeHandler}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Institution Information Column */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                Institution Details
              </h2>
              <InputField
                label="Institution Name"
                name="institutionName"
                type="text"
                placeholder="Your college/school name"
                value={profileData.institutionDetails.institutionName}
                onChangeHandler={onChangeHandler}
                required
              />
              <div className="mt-4 grid grid-cols-2 gap-4">
                <InputField
                  label="Institution Phone"
                  name="institutionPhone"
                  type="tel"
                  placeholder="Institution phone"
                  value={profileData.institutionDetails.institutionPhone}
                  onChangeHandler={onChangeHandler}
                />
                <InputField
                  label="Institution Pincode"
                  name="institutionPincode"
                  type="text"
                  placeholder="Pincode"
                  value={profileData.institutionDetails.institutionPincode}
                  onChangeHandler={onChangeHandler}
                />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <InputField
                  label="Street"
                  name="institutionStreet"
                  type="text"
                  placeholder="Institution street"
                  value={profileData.institutionDetails.institutionStreet}
                  onChangeHandler={onChangeHandler}
                />
                <InputField
                  label="City"
                  name="institutionCity"
                  type="text"
                  placeholder="Institution city"
                  value={profileData.institutionDetails.institutionCity}
                  onChangeHandler={onChangeHandler}
                />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                Course Details
              </h2>
              <InputField
                label="Course Name"
                name="courseName"
                type="text"
                placeholder="Your course name"
                value={profileData.institutionDetails.course.courseName}
                onChangeHandler={onChangeHandler}
                required
              />
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course Duration (years)
                  </label>
                  <select
                    name="courseDuration"
                    value={profileData.institutionDetails.course.courseDuration}
                    onChange={onChangeHandler}
                    className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-primary-color focus:border-primary-color"
                  >
                    <option value="">Select duration</option>
                    {[1, 2, 3, 4].map((year) => (
                      <option key={year} value={year}>
                        {year} year{year > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Year
                  </label>
                  <select
                    name="currentYear"
                    value={profileData.institutionDetails.course.currentYear}
                    onChange={onChangeHandler}
                    disabled={
                      !profileData.institutionDetails.course.courseDuration
                    }
                    className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-primary-color focus:border-primary-color disabled:bg-gray-50"
                  >
                    <option value="">Select year</option>
                    {courseYearOption.map((year) => (
                      <option key={year} value={year}>
                        Year {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end border-t border-gray-100 pt-6">
          <button
            type="submit"
            disabled={isLoading || !isDirty}
            className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
              isLoading || !isDirty
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary-color hover:bg-primary-dark"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-color transition-colors`}
          >
            {isLoading ? (
              <>
                <FiLoader className="animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <FiSave className="mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;

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

//TODO:  pincode validate, city selection

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
      setProfileData((prev) => {
        return {
          ...prev,
          firstName: studentData?.firstName || prev.firstName,
          lastName: studentData?.lastName || prev.lastName,
          email: studentData?.email || prev.email,
          address: {
            houseName:
              studentData?.address?.houseName || prev.address.houseName,
            houseCity:
              studentData?.address?.houseCity || prev.address.houseCity,
            houseStreet:
              studentData?.address?.houseStreet || prev.address.houseStreet,
            housePincode:
              studentData?.address?.housePincode || prev.address.housePincode,
          },
          mobile: studentData?.mobile || prev.mobile,
          institutionDetails: {
            institutionName:
              studentData?.institutionDetails?.institutionName ||
              prev.institutionDetails.institutionName,
            institutionStreet:
              studentData?.institutionDetails?.institutionStreet ||
              prev.institutionDetails.institutionStreet,
            institutionCity:
              studentData?.institutionDetails?.institutionCity ||
              prev.institutionDetails.institutionCity,
            institutionPincode:
              studentData?.institutionDetails?.institutionPincode ||
              prev.institutionDetails.institutionPincode,
            institutionPhone:
              studentData?.institutionDetails?.institutionPhone ||
              prev.institutionDetails.institutionPhone,
            course: {
              courseName:
                studentData?.institutionDetails?.course?.courseName ||
                prev.institutionDetails.course.courseName,
              currentYear:
                studentData?.institutionDetails?.course?.currentYear ||
                prev.institutionDetails.course.currentYear,
              courseDuration:
                studentData?.institutionDetails?.course?.courseDuration ||
                prev.institutionDetails.course.courseDuration,
            },
          },
        };
      });
      if (studentData.dateOfBirth) {
        const date = new Date(studentData.dateOfBirth);

        //Format the date to YYYY-MM-DD
        const formattedDate = date.toISOString().split("T")[0];
        setProfileData((prev) => ({
          ...prev,
          dateOfBirth: formattedDate,
        }));
      }
    }
  }, [studentData]);

  const onChangeHandler = (e) => {
    const { value, name } = e.target;

    setProfileData((prev) => {
      //Check if name belongs to address object
      if (name in prev.address) {
        return {
          ...prev,
          address: {
            ...prev.address,
            [name]: value,
          },
        };
      }

      //Check if name belongs institutionDetails
      if (name in prev.institutionDetails) {
        return {
          ...prev,
          institutionDetails: {
            ...prev.institutionDetails,
            [name]: value,
          },
        };
      }

      //Check if name belongs to course object in institutionDetails
      if (name in prev.institutionDetails.course) {
        return {
          ...prev,
          institutionDetails: {
            ...prev.institutionDetails,
            course: {
              ...prev.institutionDetails.course,
              [name]: value,
            },
          },
        };
      }

      //updating fields outside any objects
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const onSubmit = async () => {
    setIsLoading(true);
    const isValid = validateFormData();
    if (isValid) {
      try {
        const res = await update(profileData).unwrap();
        setIsLoading(false);
        enqueueSnackbar(res?.message, { variant: "success" });
      } catch (error) {
        setIsLoading(false);
        enqueueSnackbar(error?.error || error?.data?.message, {
          variant: "error",
        });
      }
    }
  };

  const validateFormData = () => {
    // PhoneInput component sets "mobile" to undefined if its empty
    if (!profileData.mobile) profileData.mobile = "";
    else {
      // validate mobile number
      const isValid = isValidPhoneNumber(profileData.mobile);
      if (!isValid) {
        enqueueSnackbar("Please enter a valid mobile number", {
          variant: "error",
        });
        setIsLoading(false);
        return false;
      }
    }

    // validate email
    if (!validator.isEmail(profileData.email)) {
      enqueueSnackbar("Please enter a valid email", { variant: "error" });
      setIsLoading(false);
      return false;
    }

    // validate institution phone
    if (
      !validator.isMobilePhone(
        profileData.institutionDetails.institutionPhone
      ) &&
      profileData.institutionDetails.institutionPhone !== ""
    ) {
      enqueueSnackbar("Please enter a valid phone(Institution)", {
        variant: "error",
      });
      setIsLoading(false);
      return false;
    }

    return true;
  };

  // Generating courseyear dynamically
  const courseYearOption = Array.from(
    {
      length:
        parseInt(profileData.institutionDetails.course.courseDuration) || 0,
    },
    (_, index) => index + 1
  );

  if (error) {
    enqueueSnackbar(error?.data.message || "Profile data not able to fetch", {
      variant: "error",
    });
    navigate("/");
  }

  if (isStudentDataLoading)
    return <p className="mt-5 ml-4 font-semibold">Loading...</p>;

  return (
    <div className="profile input-fields flex flex-col">
      <h2 className="font-[Volkhov] text-4xl font-bold mt-10 mb-4">Profile</h2>
      <form className="profile-form flex gap-20 ">
        <div className="profile-left w-[40%] flex flex-col gap-y-4">
          <div className="profile-name">
            <h4 className="font-medium text-xl">Personal</h4>
            <div className="grid grid-cols-2 gap-4">
              {/* First Name */}
              <InputField
                label={"First Name"}
                name={"firstName"}
                type={"text"}
                placeholder={"First Name"}
                value={profileData.firstName}
                onChangeHandler={onChangeHandler}
              />
              {/* Last Name */}
              <InputField
                label={"Last Name"}
                name={"lastName"}
                type={"text"}
                placeholder={"Last Name"}
                value={profileData.lastName}
                onChangeHandler={onChangeHandler}
              />
              {/* Date Of Birth  */}
              <InputField
                label={"Date of Birth"}
                name={"dateOfBirth"}
                type={"date"}
                placeholder={"Last Name"}
                value={profileData.dateOfBirth}
                onChangeHandler={onChangeHandler}
              />
            </div>
          </div>
          <div className="profile-email">
            <h4 className="font-medium text-xl">Contact</h4>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label={"Email"}
                name={"email"}
                type={"email"}
                placeholder={"Enter your email"}
                value={profileData.email}
                onChangeHandler={onChangeHandler}
              />
              <div className="phone-input">
                <label htmlFor="mobile">Mobile</label>
                <PhoneInput
                  defaultCountry="IN"
                  onChange={(value) =>
                    setProfileData((prevData) => ({
                      ...prevData,
                      mobile: value,
                    }))
                  }
                  name="mobile"
                  value={profileData.mobile}
                  placeholder="Enter your mobile no"
                />
              </div>
            </div>
          </div>
          <div className="profile-address">
            <h4 className="font-medium text-xl">Address</h4>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label={"House Name"}
                name={"houseName"}
                type={"text"}
                placeholder={"Enter your House Name"}
                value={profileData.address.houseName}
                onChangeHandler={onChangeHandler}
              />
              <InputField
                label={"House Street"}
                name={"houseStreet"}
                type={"text"}
                placeholder={"House Street"}
                value={profileData.address.houseStreet}
                onChangeHandler={onChangeHandler}
              />
              <InputField
                label={"House City"}
                name={"houseCity"}
                type={"text"}
                placeholder={"House City"}
                value={profileData.address.houseCity}
                onChangeHandler={onChangeHandler}
              />

              <InputField
                label={"Pincode"}
                name={"housePincode"}
                type={"text"}
                placeholder={"Pincode"}
                value={profileData.address.housePincode}
                onChangeHandler={onChangeHandler}
              />
            </div>
          </div>
        </div>
        <div className="profile-right flex flex-col w-[40%]">
          <h4 className="font-medium text-xl">Institution Details</h4>
          <div className="flex flex-col gap-4">
            <InputField
              label={"Institution Name"}
              name={"institutionName"}
              type={"text"}
              placeholder={"ABC College"}
              value={profileData.institutionDetails.institutionName}
              onChangeHandler={onChangeHandler}
            />
            <div className="address grid grid-cols-2 gap-4">
              <InputField
                label={"Street"}
                name={"institutionStreet"}
                type={"text"}
                placeholder={"Street"}
                value={profileData.institutionDetails.institutionStreet}
                onChangeHandler={onChangeHandler}
              />
              <InputField
                label={"City"}
                name={"institutionCity"}
                type={"text"}
                placeholder={"City"}
                value={profileData.institutionDetails.institutionCity}
                onChangeHandler={onChangeHandler}
              />
              <InputField
                label={"Pincode"}
                name={"institutionPincode"}
                type={"text"}
                placeholder={"Pincode"}
                value={profileData.institutionDetails.institutionPincode}
                onChangeHandler={onChangeHandler}
              />

              <InputField
                label={"Phone "}
                name={"institutionPhone"}
                type={"text"}
                placeholder={"Phone"}
                value={profileData.institutionDetails.institutionPhone}
                onChangeHandler={onChangeHandler}
              />
            </div>
            <div className="items-center gap-4 grid grid-cols-2">
              <InputField
                label={"Course Name"}
                name={"courseName"}
                type={"text"}
                placeholder={"Course Name"}
                value={profileData.institutionDetails.course.courseName}
                onChangeHandler={onChangeHandler}
              />
              <div>
                <label htmlFor="courseDuration">Course Duration</label>
                <select
                  name="courseDuration"
                  className="mt-[12px] p-3 rounded-lg"
                  value={profileData.institutionDetails.course.courseDuration}
                  onChange={onChangeHandler}
                  id="courseDuration"
                >
                  <option value="">Duration of course</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>
              <div>
                <label htmlFor="courseDuration">Current Year</label>
                <select
                  name="currentYear"
                  className="p-3 rounded-lg"
                  value={profileData.institutionDetails.course.currentYear}
                  onChange={onChangeHandler}
                >
                  <option value="">Select course year</option>
                  {courseYearOption.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </form>
      <button
        onClick={onSubmit}
        className={`${
          isLoading ? "button-loading" : ""
        } self-end mb-5 -mt-14 bg-primary-color text-white font-medium p-3 rounded-md transition-transform duration-100 hover:scale-105`}
      >
        <p className="button-text">Save Changes</p>
      </button>
    </div>
  );
};

export default Profile;

import { useEffect, useState } from "react";
import {
  useGetStudentDataQuery,
  useUpdateMutation,
} from "../slices/studentsApiSlice";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

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
    phone: "",
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
    },
  });

  const { data: studenData, error } = useGetStudentDataQuery();
  const [update, { isLoading }] = useUpdateMutation();

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (studenData) {
      setProfileData((prev) => {
        return {
          ...prev,
          firstName: studenData.firstName || prev.firstName,
          lastName: studenData.lastName || prev.lastName,
          email: studenData.email || prev.email,
          address: {
            houseName: studenData.address.houseName || prev.address.houseName,
            houseCity: studenData.address.houseCity || prev.address.houseCity,
            houseStreet:
              studenData.address.houseStreet || prev.address.houseStreet,
            housePincode:
              studenData.address.housePincode || prev.address.housePincode,
          },
          mobile: studenData.mobile || prev.mobile,
          phone: studenData.phone || prev.phone,
          institutionDetails: {
            institutionName:
              studenData.institutionDetails.institutionName ||
              prev.institutionDetails.institutionName,
            course: {
              courseName:
                studenData.institutionDetails.course.courseName ||
                prev.institutionDetails.course.courseName,
              currentYear:
                studenData.institutionDetails.course.currentYear ||
                prev.institutionDetails.course.currentYear,
              courseDuration:
                studenData.institutionDetails.course.courseDuration ||
                prev.institutionDetails.course.courseDuration,
            },
            institutionStreet:
              studenData.institutionDetails.institutionStreet ||
              prev.institutionDetails.institutionStreet,
            institutionCity:
              studenData.institutionDetails.institutionCity ||
              prev.institutionDetails.institutionCity,
            institutionPincode:
              studenData.institutionDetails.institutionPincode ||
              prev.institutionDetails.institutionPincode,
          },
        };
      });
      if (studenData.dateOfBirth) {
        const date = new Date(studenData.dateOfBirth);

        //Format the date to YYYY-MM-DD
        const formattedDate = date.toISOString().split("T")[0];
        setProfileData((prev) => ({
          ...prev,
          dateOfBirth: formattedDate,
        }));
      }
    }
  }, [studenData]);

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
    try {
      const res = await update(profileData).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
    } catch (error) {
      enqueueSnackbar(error?.error || error?.data?.message, {
        variant: "error",
      });
    }
  };

  if (error) {
    enqueueSnackbar(error?.message || "Profile data not able to fetch", {
      variant: "error",
    });
    navigate("/");
  }

  return (
    <div className="profile input-fields flex flex-col">
      <h2 className="font-[Volkhov] text-4xl font-bold mt-10 mb-4">Profile</h2>
      <form className="profile-form flex gap-20 ">
        <div className="profile-left w-[40%] flex flex-col gap-y-4">
          <div className="profile-name">
            <h4 className="font-medium text-xl">Personal</h4>
            <div className="grid grid-cols-2 gap-4">
              <input
                onChange={onChangeHandler}
                name="firstName"
                value={profileData.firstName}
                type="text"
                placeholder="First Name"
              />
              <input
                onChange={onChangeHandler}
                name="lastName"
                value={profileData.lastName}
                type="text"
                placeholder="Last Name"
              />
              <input
                onChange={onChangeHandler}
                name="dateOfBirth"
                value={profileData.dateOfBirth}
                type="date"
                placeholder="Date of birth"
              />
            </div>
          </div>
          <div className="profile-email">
            <h4 className="font-medium text-xl">Contact</h4>
            <div className="grid grid-cols-2 gap-4">
              <input
                onChange={onChangeHandler}
                name="email"
                value={profileData.email}
                type="email"
                placeholder="Enter your email"
              />
              <input
                onChange={onChangeHandler}
                name="mobile"
                value={profileData.mobile}
                type="number"
                maxLength={10}
                placeholder="Mobile"
              />
              <input
                onChange={onChangeHandler}
                name="phone"
                value={profileData.phone}
                type="number"
                placeholder="Phone"
              />
            </div>
          </div>
          <div className="profile-address">
            <h4 className="font-medium text-xl">Address</h4>
            <div className="grid grid-cols-2 gap-4">
              <input
                onChange={onChangeHandler}
                name="houseName"
                value={profileData.address.houseName}
                type="text"
                placeholder="House Name"
              />
              <input
                onChange={onChangeHandler}
                name="houseStreet"
                value={profileData.address.houseStreet}
                type="text"
                placeholder="Street"
              />
              <input
                onChange={onChangeHandler}
                name="houseCity"
                value={profileData.address.houseCity}
                type="text"
                placeholder="City"
              />

              <input
                onChange={onChangeHandler}
                name="housePincode"
                value={profileData.address.housePincode}
                type="number"
                placeholder="Pincode"
              />
            </div>
          </div>
        </div>
        <div className="profile-right flex flex-col w-[40%]">
          <h4 className="font-medium text-xl">Institution Details</h4>
          <div className="flex flex-col gap-4">
            <input
              className="w-full"
              name="institutionName"
              value={profileData.institutionDetails.institutionName}
              onChange={onChangeHandler}
              type="text"
              placeholder="Institution Name"
            />
            <div className="address grid grid-cols-2 gap-4">
              <input
                name="institutionStreet"
                value={profileData.institutionDetails.institutionStreet}
                onChange={onChangeHandler}
                type="text"
                placeholder="Street"
              />
              <input
                name="institutionCity"
                value={profileData.institutionDetails.institutionCity}
                onChange={onChangeHandler}
                type="text"
                placeholder="City"
              />
              <input
                name="institutionPincode"
                value={profileData.institutionDetails.institutionPincode}
                onChange={onChangeHandler}
                type="text"
                placeholder="Pincode"
              />
            </div>
            <div className="items-center gap-4 grid grid-cols-2">
              <input
                type="text"
                placeholder="Course Name"
                name="courseName"
                value={profileData.institutionDetails.course.courseName}
                onChange={onChangeHandler}
              />
              <select
                name="currentYear"
                className="mt-[12px] p-3 rounded-lg"
                value={profileData.institutionDetails.course.currentYear}
                onChange={onChangeHandler}
              >
                <option value="">Select course year</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
              <select
                name="courseDuration"
                className="mt-[12px] p-3 rounded-lg"
                value={profileData.institutionDetails.course.courseDuration}
                onChange={onChangeHandler}
              >
                <option value="">Duration of course</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>
          </div>
        </div>
      </form>
      <button
        onClick={onSubmit}
        className={`${
          isLoading ? "button-loading" : ""
        } self-end mt-5 bg-primary-color text-white font-medium p-3 rounded-md transition-transform duration-100 hover:scale-105`}
      >
        <p className="button-text">Save Changes</p>
      </button>
    </div>
  );
};

export default Profile;

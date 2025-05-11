import { useEffect, useState } from "react";
import { FiPlus, FiLoader } from "react-icons/fi";
import { enqueueSnackbar } from "notistack";
import {
  useApplyForConcessionMutation,
  useGetStudentDataQuery,
} from "../slices/studentsApiSlice";
import StudentRoutesField from "../components/StudentRoutesField";
import { Link, Navigate } from "react-router-dom";

const Apply = () => {
  const [routes, setRoutes] = useState([
    { startingPoint: "", destination: "" },
  ]);
  const maxRoutes = 4;

  const {
    data: studentData,
    error,
    refetch,
    isLoading: isStudentDataLoading,
  } = useGetStudentDataQuery();
  const [applyForConcession, { isLoading }] = useApplyForConcessionMutation();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const addRouteField = () => {
    if (routes.length < maxRoutes) {
      setRoutes((prev) => [...prev, { startingPoint: "", destination: "" }]);
    }
  };

  const onChangeHandler = (i, e) => {
    const { name, value } = e.target;
    setRoutes((prev) => {
      const newRoutes = [...prev];
      newRoutes[i] = { ...newRoutes[i], [name]: value };
      return newRoutes;
    });
  };

  const removeRoute = (index) => {
    if (routes.length > 1) {
      setRoutes((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const applyForConcessionCard = async () => {
    try {
      // Validate at least one route is filled
      if (routes.some((route) => !route.startingPoint || !route.destination)) {
        enqueueSnackbar("Please fill all route fields", { variant: "warning" });
        return;
      }

      const response = await applyForConcession(routes).unwrap();
      enqueueSnackbar(
        response.message || "Application submitted successfully!",
        {
          variant: "success",
          autoHideDuration: 3000,
        }
      );
    } catch (err) {
      enqueueSnackbar(err.data?.message || "Failed to submit application", {
        variant: "error",
        autoHideDuration: 4000,
      });
    }
  };

  const getStatusMessage = () => {
    if (studentData?.application?.status === "approved") {
      return {
        text: (
          <>
            Student Concession Approved.{" "}
            <Link
              className="font-semibold hover:underline"
              to="/view-concession"
            >
              Click to view
            </Link>
          </>
        ),
        color: "text-green-600",
      };
    }

    if (studentData?.application?.status !== "false") {
      return {
        text: "Student already applied for Concession card.",
        color: "text-red-500",
      };
    }
    if (studentData?.eligibility?.status === "false") {
      return {
        text: (
          <>
            Student identity not verified.{" "}
            <Link className="font-semibold hover:underline" to="/verify">
              Click to Verify
            </Link>
          </>
        ),
        color: "text-red-500",
      };
    }
    if (studentData?.eligibility?.status === "pending") {
      return {
        text: "Student ID under verification. Please wait.",
        color: "text-yellow-600",
      };
    }
    if (studentData?.eligibility?.status === "approved") {
      return {
        text: "You are eligible for the Student Concession Card. Proceed with your application.",
        color: "text-green-600",
      };
    }
    return null;
  };

  const statusMessage = getStatusMessage();
  const canApply =
    studentData?.eligibility?.status === "approved" &&
    studentData?.application?.status === "false";

  if (isStudentDataLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-color"></div>
      </div>
    );
  }

  if (error) {
    enqueueSnackbar("Failed to load student data", { variant: "error" });
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-['Volkhov'] text-primary-color">
          Apply for Student Concession Card
        </h1>
        {statusMessage && (
          <p className={`mt-2 ${statusMessage.color}`}>{statusMessage.text}</p>
        )}
      </div>

      {/* Routes Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Bus Route Information
        </h2>

        <div className="space-y-4">
          {routes.map((_, i) => (
            <StudentRoutesField
              key={i}
              index={i}
              routes={routes}
              onChangeHandler={onChangeHandler}
              onRemove={routes.length > 1 ? removeRoute : null}
            />
          ))}
        </div>

        {routes.length < maxRoutes && (
          <button
            type="button"
            onClick={addRouteField}
            className="mt-4 flex items-center text-primary-color hover:text-primary-dark transition-colors"
          >
            <FiPlus className="mr-2" />
            Add Another Route
          </button>
        )}
      </div>

      {/* Submit Section */}
      <div className="flex justify-end">
        <button
          onClick={applyForConcessionCard}
          disabled={!canApply || isLoading}
          className={`px-6 py-3 rounded-md font-medium text-white ${
            !canApply || isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary-color hover:bg-primary-dark"
          } transition-colors flex items-center`}
        >
          {isLoading ? (
            <>
              <FiLoader className="animate-spin mr-2" />
              Submitting...
            </>
          ) : (
            "Submit Application"
          )}
        </button>
      </div>
    </div>
  );
};

export default Apply;

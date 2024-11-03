import { useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { enqueueSnackbar } from "notistack";
import { useApplyForConcessionMutation } from "../slices/studentsApiSlice";
import StudentRoutesField from "../components/StudentRoutesField";

const Apply = () => {
  const [routeFieldComponent, setRouteFieldComponent] = useState([
    <StudentRoutesField />,
  ]);
  const [routes, setRoutes] = useState([
    {
      startingPoint: "",
      destination: "",
    },
  ]);

  const [applyForConcession] = useApplyForConcessionMutation();

  const addRouteField = () => {
    setRoutes((prev) => [...prev, { startingPoint: "", destination: "" }]);

    setRouteFieldComponent((prev) => [
      ...prev,
      <StudentRoutesField key={prev.length} />,
    ]);
  };

  const onChangeHandler = (i, e) => {
    const { name, value } = e.target;
    setRoutes((prev) => {
      const newRoutes = [...prev];
      newRoutes[i] = { ...newRoutes[i], [name]: value };
      return newRoutes;
    });
  };
  const applyForConcessionCard = async () => {
    console.log(routes);
    try {
      const response = await applyForConcession(routes).unwrap();
      enqueueSnackbar(response.message, { variant: "success" });
    } catch (err) {
      enqueueSnackbar(err.data.message || "Something went wrong", {
        variant: "error",
      });
    }
  };

  return (
    <div className="apply flex flex-col justify-center mt-7 w-max">
      <div className="flex flex-col">
        <h2 className="text-3xl font-semibold font-[Volkhov]">
          Apply for Student Concession Card
        </h2>
        {routeFieldComponent.map((item, i) => (
          <StudentRoutesField
            key={i}
            i={i}
            routes={routes}
            onChangeHandler={onChangeHandler}
          />
        ))}
      </div>
      {!(routeFieldComponent.length >= 4) ? (
        <div className="flex items-center">
          <CiCirclePlus
            onClick={addRouteField}
            size="2em"
            className="mx-3 cursor-pointer translate-transform duration-100 hover:scale-105"
          />
          <p>Add Route</p>
        </div>
      ) : (
        <></>
      )}
      <button
        onClick={applyForConcessionCard}
        className={`self-end bg-primary-color text-white font-medium p-3 rounded-md transition-transform duration-100 hover:scale-105`}
      >
        <p className="button-text">Apply</p>
      </button>
    </div>
  );
};

export default Apply;

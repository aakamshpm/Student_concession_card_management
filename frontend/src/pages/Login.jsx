import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import {
  useGetStudentDataQuery,
  useLoginMutation,
  useRegisterMutation,
} from "../slices/studentsApiSlice";
import { setCredentials } from "../slices/authSlice";

const Login = () => {
  const [currState, setCurrState] = useState("Login"); // Login or Register
  const [isLoading, setIsLoading] = useState(false); // Loading state for button
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState(""); // For password mismatch

  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login] = useLoginMutation();
  const [register] = useRegisterMutation();

  const onChangeHandler = (e) => {
    const { name, value } = e.target;

    setData((prev) => ({ ...prev, [name]: value }));

    if (name === "confirmPassword" || name === "password") setPasswordError(""); // setting password error to null

    if (name === "confirmPassword" && value !== data.password)
      setPasswordError("Passwords do not match"); // checking for password match
    else if (
      name === "password" &&
      data.confirmPassword &&
      value !== data.confirmPassword
    )
      setPasswordError("Passwords do not match");
  };

  const onLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response =
        currState === "Login"
          ? await login(data).unwrap()
          : await register(data).unwrap();

      dispatch(setCredentials({ ...response.data }));
      // await refetch();
      navigate("/");
    } catch (err) {
      enqueueSnackbar(err?.error || err?.data?.message, { variant: "error" });
      console.error(err?.error || err?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login w-full h-screen flex justify-center items-center">
      <div
        className={`${
          currState === "Login" ? "w-[28em] h-[26em]" : "w-[32em] h-[32em]"
        }  border-primary-color border-2 border-solid rounded-2xl flex flex-col items-center`}
      >
        <h1 className="text-black mt-7 text-2xl font-semibold">
          Student {currState}
        </h1>
        <form
          onSubmit={onLogin}
          className="flex flex-col items-center w-[26em]"
        >
          <div className="input-fields mt-10 flex flex-col items-center gap-4 w-[80%]">
            {currState === "Login" ? (
              <></>
            ) : (
              <div className="flex justify-center gap-2">
                <input
                  className="outline-none border-[1px] border-solid border-[#E5E5E5] w-[55%] h-10 p-5 rounded-md text-sm"
                  type="text"
                  placeholder="First Name"
                  name="firstName"
                  value={data.firstName}
                  onChange={onChangeHandler}
                />
                <input
                  className="outline-none border-[1px] border-solid border-[#E5E5E5] w-[45%] h-10 p-5 rounded-md text-sm"
                  type="text"
                  placeholder="Last Name"
                  name="lastName"
                  value={data.lastName}
                  onChange={onChangeHandler}
                />
              </div>
            )}
            <input
              className="outline-none border-[1px] border-solid border-[#E5E5E5] w-full h-10 p-5 rounded-md text-sm focus:border-black"
              type="email"
              placeholder="Enter your email"
              name="email"
              value={data.email}
              onChange={onChangeHandler}
            />
            <input
              className="outline-none border-[1px] border-solid border-[#E5E5E5] w-full h-10 p-5 rounded-md text-sm focus:border-black"
              type="password"
              placeholder="Enter your password"
              name="password"
              value={data.password}
              onChange={onChangeHandler}
            />
            {currState !== "Login" && (
              <>
                <input
                  className="outline-none border-[1px] border-solid border-[#E5E5E5] w-full h-10 p-5 rounded-md text-sm focus:border-black"
                  type="password"
                  placeholder="Confirm your password"
                  name="confirmPassword"
                  value={data.confirmPassword}
                  onChange={onChangeHandler}
                />
                {passwordError && (
                  <span className="text-red-600 text-xs -mt-4">
                    {passwordError}
                  </span>
                )}
              </>
            )}
          </div>

          <button
            type="submit"
            className={`${
              isLoading ? "button-loading" : ""
            } mt-6 mb-5 bg-primary-color text-white font-medium px-7 py-2 rounded-full ${
              currState === "Register" &&
              passwordError &&
              "opacity-60 cursor-not-allowed"
            }  ${
              (!passwordError || currState === "Login") &&
              "opacity-100 transition-transform duration-100 hover:scale-105"
            }`}
            disabled={(passwordError && currState === "Register") || isLoading}
          >
            <p className="button-text">
              {currState === "Register" ? "Register" : "Login"}
            </p>
          </button>
        </form>
        {currState !== "Login" ? (
          <p className="text-sm text-[#666666]">
            Already have an account?{" "}
            <span
              onClick={() => setCurrState("Login")}
              className="cursor-pointer text-[#222222] transition-transform duration-300 ease-in-out transform hover:scale-105"
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="text-sm text-[#666666]">
            Create an new account?{" "}
            <span
              onClick={() => setCurrState("Register")}
              className="cursor-pointer text-[#222222] transition-transform duration-300 ease-in-out transform hover:scale-105 inline-block"
            >
              Register here
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;

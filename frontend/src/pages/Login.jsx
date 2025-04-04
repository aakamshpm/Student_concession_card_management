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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {currState === "Login" ? "Welcome Back" : "Create Your Account"}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {currState === "Login"
            ? "Sign in to your student account"
            : "Register for student concession benefits"}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200">
          <form onSubmit={onLogin} className="space-y-6">
            {currState === "Register" && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={data.firstName}
                    onChange={onChangeHandler}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-color focus:border-primary-color sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={data.lastName}
                    onChange={onChangeHandler}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-color focus:border-primary-color sm:text-sm"
                  />
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={data.email}
                onChange={onChangeHandler}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-color focus:border-primary-color sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={data.password}
                onChange={onChangeHandler}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-color focus:border-primary-color sm:text-sm"
              />
            </div>

            {currState === "Register" && (
              <>
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={data.confirmPassword}
                    onChange={onChangeHandler}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-color focus:border-primary-color sm:text-sm"
                  />
                </div>
                {passwordError && (
                  <p className="mt-1 text-sm text-red-600">{passwordError}</p>
                )}
              </>
            )}

            <div>
              <button
                type="submit"
                disabled={
                  isLoading || (currState === "Register" && passwordError)
                }
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isLoading || (currState === "Register" && passwordError)
                    ? "bg-primary-color/70 cursor-not-allowed"
                    : "bg-primary-color hover:bg-primary-dark"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-color transition-colors`}
              >
                {isLoading ? (
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
                ) : null}
                {currState === "Login" ? "Sign in" : "Register"}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {currState === "Login"
                    ? "New to us?"
                    : "Already have an account?"}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={() =>
                  setCurrState(currState === "Login" ? "Register" : "Login")
                }
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:outline-none hover:border-none hover:ring-2 hover:ring-offset-2 hover:ring-primary-color transition-colors"
              >
                {currState === "Login"
                  ? "Create new account"
                  : "Sign in instead"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import {
  useLoginMutation,
  useRegisterMutation,
} from "../slices/studentsApiSlice";
import { setCredentials } from "../slices/authSlice";

const Login = () => {
  const [currState, setCurrState] = useState("Login");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const { enqueueSnackbar } = useSnackbar();

  const distpatch = useDispatch();
  const navigate = useNavigate();

  const [login] = useLoginMutation();
  const [register] = useRegisterMutation();

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let response;
      if (currState === "Login") {
        response = await login(data).unwrap();
      } else {
        response = await register(data).unwrap();
      }
      distpatch(setCredentials({ ...response.data }));
      navigate("/");
    } catch (err) {
      setIsLoading(false);
      enqueueSnackbar(err?.error || err?.data?.message, { variant: "error" });
      console.log(err?.error || err?.data?.message);
    }
  };

  return (
    <div className="login w-full h-screen flex justify-center items-center">
      <div className="w-[30em] h-[28em] border-primary-color border-2 border-solid rounded-2xl flex flex-col items-center">
        <h1 className="text-black mt-7 text-2xl font-semibold">
          Student {currState}
        </h1>
        <form
          onSubmit={onLogin}
          className="flex flex-col items-center w-[26em]"
        >
          <div className="input-fields mt-16 flex flex-col items-center gap-5 w-[80%]">
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
                  placeholder="First Name"
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
          </div>
          <button
            type="submit"
            className={`${
              isLoading ? "button-loading" : ""
            } relative mt-8 mb-5 bg-primary-color py-2 px-7  text-white rounded-full hover:bg-orange-600 transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center`}
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

import { useState } from "react";

const Login = () => {
  const [currState, setCurrState] = useState("Login");
  return (
    <div className="login w-full h-screen flex justify-center items-center">
      <div className=" w-[30em] h-[28em] border-primary-color border-2 border-solid rounded-2xl flex flex-col items-center">
        <h1 className="text-black mt-7 text-2xl font-semibold">
          Student {currState}
        </h1>
        <div className="input-fields mt-16 flex flex-col items-center gap-5 w-full">
          {currState === "Login" ? (
            <></>
          ) : (
            <input
              className="outline-none border-[1px] border-solid border-[#E5E5E5] w-5/6 h-10 p-5 rounded-md text-sm"
              type="text"
              placeholder="Enter your name"
            />
          )}
          <input
            className="outline-none border-[1px] border-solid border-[#E5E5E5] w-5/6 h-10 p-5 rounded-md text-sm focus:border-black"
            type="email"
            placeholder="Enter your email"
          />
          <input
            className="outline-none border-[1px] border-solid border-[#E5E5E5] w-5/6 h-10 p-5 rounded-md text-sm focus:border-black"
            type="text"
            placeholder="Enter your password"
          />
        </div>
        <button className="mt-8 mb-5 bg-primary-color py-2 px-7 text-white rounded-full hover:bg-orange-600 transition duration-300 ease-in-out transform hover:scale-105">
          {currState === "Register" ? "Create new account" : "Login"}
        </button>
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

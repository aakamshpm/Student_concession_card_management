import { useState } from "react";
import { useLoginMutation } from "../slices/adminApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [data, setData] = useState({
    username: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login] = useLoginMutation();

  const onChangeHandler = (e) => {
    const { name, value } = e.target;

    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onLogin = async () => {
    try {
      const response = await login(data).unwrap();
      dispatch(setCredentials({ ...response.data }));
      navigate("/");
    } catch (err) {
      console.log(err.data.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-16 flex flex-col justify-center gap-4  border-2 border-gray-500 rounded-lg">
        <div className="header flex flex-col gap-2">
          <h1 className="font-bold text-3xl">Welcome</h1>
          <p className="opacity-50 text-sm">Sign up on internal platform</p>
        </div>
        <div className="input-fields flex flex-col p-2 gap-2 w-[20rem]">
          {/* Username */}
          <label className="font-semibold " htmlFor="username">
            Username
          </label>
          <input
            className="outline-none border-[1px] rounded-md border-gray-500 p-3 w-full"
            type="username"
            name="username"
            value={data.username}
            onChange={onChangeHandler}
            placeholder="Enter your username"
          />

          {/* Password */}
          <label className="font-semibold " htmlFor="password">
            Password
          </label>
          <input
            className="outline-none border-[1px] rounded-md border-gray-500 p-3 w-full"
            type="password"
            name="password"
            value={data.password}
            onChange={onChangeHandler}
            placeholder="Enter your password"
          />
        </div>
        <button
          onClick={onLogin}
          className="p-3 w-full bg-primary-color text-white rounded-lg transition-transform duration-200 hover:scale-105"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Login;

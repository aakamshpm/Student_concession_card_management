import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import OtpInput from "react-otp-input";
import { enqueueSnackbar } from "notistack";
import { FiArrowRight, FiArrowLeft, FiCheck } from "react-icons/fi";
// import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import axios from "axios";
import {
  auth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "../config/firebase";
import "react-phone-number-input/style.css";

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //State for storing confirmation from firebase to send to backend for OTP verification
  const [confirmationResult, setConfirmationResult] = useState("");

  const navigate = useNavigate();

  const sendOTP = async (phoneNumber) => {
    setIsLoading(true);
    try {
      if (!isValidPhoneNumber(phoneNumber)) {
        enqueueSnackbar("Invalid Phone Number", { variant: "error" });
        setIsLoading(false);
        return;
      }

      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        { size: "invisible" }
      );

      const confirmation = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        window.recaptchaVerifier
      );

      setConfirmationResult(confirmation);
      enqueueSnackbar("OTP successfully sent", { variant: "success" });

      setShowOtpSection(true);

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      enqueueSnackbar(error?.message || "OTP failed to sent", {
        variant: "error",
      });
      setIsLoading(false);
    }
  };

  const verifyOTP = async (otp) => {
    setIsLoading(true);

    try {
      const result = await confirmationResult.confirm(otp);
      const firebaseToken = await result.user.getIdToken();

      // Server otp validation with user
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/auth`,
        { firebaseToken },
        { withCredentials: true }
      );

      localStorage.setItem("role", "admin");
      localStorage.setItem("adminInfo", response.data.token);
      enqueueSnackbar("OTP Verification done", { variant: "success" });
      setIsLoading(false);
      navigate("/");
    } catch (error) {
      enqueueSnackbar(error?.message || "OTP Verification failed", {
        variant: "error",
      });
      setIsLoading(false);
    }
  };

  const BackArrow = () => (
    <button
      onClick={() => setShowOtpSection(false)}
      className="absolute top-6 left-6 p-2 rounded-full hover:bg-gray-100 transition-colors"
    >
      <FiArrowLeft className="text-gray-600 text-xl" />
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-8 relative">
        {showOtpSection && <BackArrow />}

        <h1 className="text-2xl font-bold text-center mb-8 font-['Volkhov'] text-primary-color">
          {showOtpSection ? "Enter OTP" : "Admin Login"}
        </h1>
        <div id="recaptcha-container" />

        {!showOtpSection ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="flex items-center gap-2">
                <PhoneInput
                  international
                  defaultCountry="IN"
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" &&
                      phoneNumber &&
                      !isLoading &&
                      isValidPhoneNumber(phoneNumber)
                    ) {
                      sendOTP(phoneNumber);
                    }
                  }}
                  className="input-phone-number flex-1 border border-gray-300 rounded-lg px-4 py-3"
                />
                <button
                  onClick={() => sendOTP(phoneNumber)}
                  disabled={
                    !phoneNumber ||
                    isLoading ||
                    !isValidPhoneNumber(phoneNumber)
                  }
                  className={`p-3 rounded-lg ${
                    !phoneNumber ||
                    isLoading ||
                    !isValidPhoneNumber(phoneNumber)
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-primary-color hover:bg-primary-dark"
                  } text-white transition-colors`}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <FiArrowRight className="text-xl" />
                  )}
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-500 text-center">
              We'll send you a 6-digit OTP for verification
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-600 text-center mb-4">
                OTP sent to <span className="font-medium">{phoneNumber}</span>
              </p>

              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                renderSeparator={<span className="mx-1"></span>}
                renderInput={(props) => (
                  <input
                    {...props}
                    onKeyDown={(e) => {
                      props.onKeyDown?.(e);
                      if (
                        e.key === "Enter" &&
                        otp &&
                        otp.length === 6 &&
                        !isLoading
                      ) {
                        verifyOTP(otp);
                      }
                    }}
                  />
                )}
                inputStyle={{
                  width: "3rem",
                  height: "3rem",
                  fontSize: "1.2rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #D1D5DB",
                  outline: "none",
                  transition: "border-color 0.3s ease",
                  marginTop: "10px",
                }}
                focusStyle={{
                  borderColor: "#10B981",
                  boxShadow: "0 0 0 2px rgba(16, 185, 129, 0.2)",
                }}
                containerStyle={{
                  justifyContent: "center",
                }}
                shouldAutoFocus
              />
              <button
                onClick={() => verifyOTP(otp)}
                disabled={otp.length < 6 || isLoading}
                className={`w-full py-3 rounded-lg font-medium ${
                  otp.length < 6 || isLoading
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-primary-color hover:bg-primary-dark"
                } text-white transition-colors flex items-center justify-center`}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Verifying...
                  </>
                ) : (
                  <>
                    <FiCheck className="mr-2" />
                    Continue
                  </>
                )}
              </button>
            </div>

            <div className="text-center">
              <button
                onClick={() => {
                  setShowOtpSection(false);
                  setOtp("");
                }}
                className="text-sm text-primary-color hover:underline"
              >
                Resend OTP
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;

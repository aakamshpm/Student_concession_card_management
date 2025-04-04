import { FiAlertCircle } from "react-icons/fi";

const InputField = ({
  label,
  name,
  onChangeHandler,
  type = "text",
  value,
  placeholder,
  error,
  required = false,
  className = "",
  disabled = false,
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className={`text-sm font-medium ${
            error ? "text-red-600" : "text-gray-700"
          }`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          name={name}
          value={value}
          id={name}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          onChange={onChangeHandler}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 ${
            error
              ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300 placeholder-gray-400 focus:ring-primary-color focus:border-primary-color"
          } ${disabled ? "bg-gray-50 cursor-not-allowed" : ""}`}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${name}-error` : undefined}
          {...props}
        />
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <FiAlertCircle className="h-5 w-5 text-red-500" />
          </div>
        )}
      </div>

      {error && (
        <p id={`${name}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default InputField;

const InputField = ({
  label,
  name,
  onChangeHandler,
  type,
  value,
  placeholder,
}) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={name}>{label}</label>
      <input
        onChange={onChangeHandler}
        name={name}
        value={value}
        id={name}
        type={type}
        placeholder={placeholder}
      />
    </div>
  );
};

export default InputField;

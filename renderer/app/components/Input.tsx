export default function Input({
  type,
  id,
  className,
  value,
  onChange = (any) => {},
  isHandleChange = false,
  autoFocus = false,
  required = false,
  disabled = false,
  pattern = ".*",
}) {
  const handleOnChange = (event) => {
    let value = event.target.value;
    if (type === "number") value = value.replace(/\D/g, "");
    onChange(value);
  };

  return (
    <input
      type={type}
      // type="text"
      id={id}
      className={
        className +
        " text-gray-700 bg-white border border-gray-300 rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
      }
      value={value}
      pattern={pattern}
      onChange={isHandleChange ? onChange : handleOnChange}
      autoFocus={autoFocus}
      required={required}
      disabled={disabled}
    />
  );
}

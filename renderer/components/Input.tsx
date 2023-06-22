import showAlert from "@/components/showAlert";

type InputProps = {
  type: string;
  id: string;
  className?: string;
  value: string;
  onChange?: (any) => void;
  isHandleChange?: boolean;
  autoFocus?: boolean;
  required?: boolean;
  disabled?: boolean;
  pattern?: string;
};

export default function Input({
  type,
  id,
  className,
  value,
  onChange,
  isHandleChange,
  autoFocus,
  required,
  disabled,
  pattern = ".*",
}: InputProps) {
  const isphone = id === "cellphone" || id === "telephone";

  const handleCellphoneChange = (event) => {
    let value = event.target.value.replace(/[^\d]/g, "");
    if (value.length > 0) {
      value =
        value.substring(0, 3) +
        (value.length > 3 ? " " + value.substring(3) : "");
    }
    if (value.length > 7) {
      value =
        value.substring(0, 7) +
        (value.length > 7 ? " " + value.substring(7) : "");
    }
    if (value.length > 12) {
      showAlert(
        "warning",
        "El número de teléfono no puede tener más de 10 dígitos"
      );
      return;
    }
    onChange(value);
  };

  const handleOnChange = (event) => {
    let value = event.target.value;
    if (type === "number") value = value.replace(/\D/g, "");
    onChange(value);
  };

  return (
    <input
      type={type}
      id={id}
      className={
        className +
        " text-gray-700 bg-white border border-gray-300 rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
      }
      value={value}
      pattern={pattern}
      onChange={
        isphone
          ? handleCellphoneChange
          : isHandleChange
          ? onChange
          : handleOnChange
      }
      autoFocus={autoFocus}
      required={required}
      disabled={disabled}
    />
  );
}

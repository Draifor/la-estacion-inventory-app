type Props = {
  type?: "button" | "submit" | "reset";
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  baseStyle?: string;
};

export default function Button({
  type = "button",
  className = "",
  onClick,
  children,
  baseStyle = "",
}: Props) {
  let defaultStyle =
    "bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md";

  if (baseStyle === "none") defaultStyle = "";
  return (
    <button
      className={`${className} ${defaultStyle}`}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

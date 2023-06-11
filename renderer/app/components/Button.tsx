type Props = {
  type?: "button" | "submit" | "reset";
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
};

export default function Button ({ type = "button", className = "", onClick, children }: Props) {
  return (
    <button
      className={`${className} bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md`}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

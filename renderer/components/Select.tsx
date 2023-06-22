import DownArrow from "@/components/icons/DownArrow";

export default function Select({
  id,
  className,
  value,
  onChange,
  children,
  isHandleChange = false,
}) {
  return (
    <div className="inline-block relative">
      <select
        id={id}
        className={
          className +
          " block appearance-none w-full text-gray-700 bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
        }
        value={value}
        onChange={
          isHandleChange ? onChange : (event) => onChange(event.target.value)
        }
      >
        {children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <DownArrow />
      </div>
    </div>
  );
}

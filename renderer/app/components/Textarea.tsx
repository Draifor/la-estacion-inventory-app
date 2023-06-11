export default function Textarea({id, className, value, onChange = (any)=>{}, isHandleChange = false, required = false, disabled = false}) {
  return (
    <textarea
              id={id}
              className={className + " text-gray-700 bg-white border border-gray-300 rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"}
              value={value}
              onChange={isHandleChange ? onChange : (event) => onChange(event.target.value)}
              required={required}
              disabled={disabled}
            />
  );
}

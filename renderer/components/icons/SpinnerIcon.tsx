export default function Spinner({ className }) {
  return (
    <svg
      className={`${className} animate-spin`}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="spinner-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke="url(#spinner-gradient)"
        strokeWidth="10"
        strokeDasharray="212.05750411731147 70.68583470577049"
      />
    </svg>
  );
}

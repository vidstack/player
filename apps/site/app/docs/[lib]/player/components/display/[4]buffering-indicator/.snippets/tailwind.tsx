<div className="absolute inset-0 flex items-center justify-center w-full h-full pointer-events-none z-10">
  <svg
    className="w-24 h-24 text-white opacity-0 transition-opacity duration-200 ease-linear buffering:opacity-100 buffering:animate-spin"
    fill="none"
    viewBox="0 0 120 120"
    aria-hidden="true"
  >
    <circle className="opacity-25" cx="60" cy="60" r="54" stroke="currentColor" strokeWidth="8" />
    <circle
      className="opacity-75"
      cx="60"
      cy="60"
      r="54"
      stroke="currentColor"
      strokeWidth="10"
      pathLength="100"
      style={{
        strokeDasharray: 100,
        strokeDashoffset: 50,
      }}
    />
  </svg>
</div>;

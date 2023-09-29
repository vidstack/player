<div className="pointer-events-none absolute inset-0 z-50 flex h-full w-full items-center justify-center">
  <svg
    className="buffering:opacity-100 buffering:animate-spin h-24 w-24 text-white opacity-0 transition-opacity duration-200 ease-linear"
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

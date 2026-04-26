import React from "react";

function Spinner(): React.JSX.Element {
  return (
    <svg
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-rotator"
      width="60px"
      height="60px"
      viewBox="0 0 60 60"
    >
      <circle
        className="stroke-black dark:stroke-white stroke-2 stroke-dasharray-200 stroke-dashoffset-100"
        fill="none"
        strokeWidth="5"
        strokeLinecap="round"
        cx="30"
        cy="30"
        r="27"
      />
    </svg>
  );
}

export default Spinner;

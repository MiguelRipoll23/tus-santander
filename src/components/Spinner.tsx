import React from "react";

function Spinner(): React.JSX.Element {
  return (
    <svg
      className="fixed top-[calc(50%-30px)] left-[calc(50%-30px)] [animation:rotator_0.6s_linear_infinite]"
      width="60px"
      height="60px"
      viewBox="0 0 60 60"
    >
      <circle
        className="stroke-black dark:stroke-white [stroke-width:2px] [stroke-dasharray:200] [stroke-dashoffset:100] [transform-origin:center]"
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

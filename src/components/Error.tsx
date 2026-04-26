import React from "react";
import type { MouseEventHandler } from "react";
import Button from "./Button";

interface ErrorProps {
  errorText: string;
  retryText: string;
  retryAction: MouseEventHandler<HTMLButtonElement>;
}

function Error(
  { errorText, retryText, retryAction }: ErrorProps,
): React.JSX.Element {
  return (
    <div className="text-center fixed top-1/2 -translate-y-1/2 w-full px-20 box-border inline-block animate-fade-in" style={{ transform: 'translateY(calc(-50% - 42px))' }}>
      <div className="mb-3.5">{errorText}</div>
      <Button color="var(--color-light-blue)" onClick={retryAction}>
        {retryText}
      </Button>
    </div>
  );
}

export default Error;

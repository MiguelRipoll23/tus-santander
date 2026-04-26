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
    <div className="text-center fixed top-[calc(50%-42px)] w-full px-20 box-border inline-block animate-fade-in">
      <div className="mb-3.5">{errorText}</div>
      <Button color="var(--color-light-blue)" onClick={retryAction}>
        {retryText}
      </Button>
    </div>
  );
}

export default Error;

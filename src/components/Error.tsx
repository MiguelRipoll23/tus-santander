import React from "react";
import type { MouseEventHandler } from "react";
import styles from "./Error.module.css";
import Button from "./Button";

interface ErrorProps {
  errorText: string;
  retryText: string;
  retryAction: MouseEventHandler<HTMLButtonElement>;
  animation?: string;
}

function Error({ errorText, retryText, retryAction }: ErrorProps): React.JSX.Element {
  return (
    <div className={styles.Error}>
      <div className={styles.Text}>{errorText}</div>
      <Button color="var(--color-light-blue)" onClick={retryAction}>
        {retryText}
      </Button>
    </div>
  );
}

export default Error;

import React from "react";
import type { EstimationTuple } from "../types/estimations";
import styles from "./StopLines.module.css";
import {
  getLineBackgroundColor,
  getLineTextColor,
} from "../utils/LineUtils";

interface StopLinesProps {
  size?: string;
  list: string[];
  estimations?: readonly EstimationTuple[];
  className?: string;
}

function isDisabled(
  label: string,
  estimations: readonly EstimationTuple[] | undefined
): boolean {
  if (estimations === undefined) return false;

  for (const item of estimations) {
    const [etaLabel] = item;
    if (label === etaLabel) return false;
  }

  return true;
}

function handleOnClick(label: string): void {
  const labelElement = document.querySelector(`#label-${label}`);
  labelElement?.scrollIntoView({ behavior: "smooth", block: "center" });
}

function StopLines({ size, list, estimations }: StopLinesProps): React.JSX.Element {
  const isSmall = size === "small";
  const height = isSmall ? "28px" : "36px";
  const paddingLeft = isSmall ? "0" : "var(--margin-lr)";

  return (
    <div
      className={styles.stopLines}
      style={{
        "--padding-left": paddingLeft,
        "--height": height,
      }}
    >
        {list.map((label) => {
        const isDisabledBtn = isDisabled(label, estimations);
        const buttonClass = `${styles.stopLine} ${
          isSmall ? styles.stopLineSmall : styles.stopLineLarge
        }`;

        return (
          <button
            type="button"
            key={label}
            className={buttonClass}
            disabled={isDisabledBtn}
            style={{
              background: getLineBackgroundColor(label, "string"),
              color: getLineTextColor(label),
            }}
            onClick={() => handleOnClick(label)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default StopLines;

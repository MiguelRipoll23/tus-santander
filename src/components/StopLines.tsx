import React from "react";
import type { EstimationTuple } from "../types/estimations";
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
  const paddingLeft = isSmall ? "0" : "14px";

  return (
    <div
      className="mt-1.75 pr-[14px] text-white overflow-x-auto whitespace-nowrap scrollbar-hide"
      style={{ paddingLeft, height }}
    >
      {list.map((label, i) => {
        const isDisabledBtn = isDisabled(label, estimations);
        const baseClasses = "leading-6 text-center inline-block font-normal rounded-full cursor-pointer";
        const sizeClasses = isSmall
          ? "text-xs mr-1.25 min-w-8.75 py-0.5"
          : "text-lg mr-1.75 min-w-12 py-1.5";

        return (
          <button
            type="button"
            key={i}
            className={`${baseClasses} ${sizeClasses} disabled:opacity-10 disabled:cursor-default dark:disabled:bg-white dark:disabled:text-black dark:disabled:opacity-40`}
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

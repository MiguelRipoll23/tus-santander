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
  const paddingLeft = isSmall ? "0" : "var(--margin-lr)";

  return (
    <div
      className="mt-[7px] pr-3.5 text-white overflow-x-scroll whitespace-nowrap [&::-webkit-scrollbar]:hidden"
      style={{
        height,
        paddingLeft,
      }}
    >
      {list.map((label, i) => {
        const isDisabledBtn = isDisabled(label, estimations);
        const sizeClass = isSmall
          ? "text-xs mr-[5px] min-w-[35px] py-[2px] cursor-default"
          : "text-[18px] mr-[7px] min-w-[48px] py-[6px]";

        return (
          <button
            type="button"
            key={i}
            className={`leading-6 text-center inline-block font-normal rounded-[30px] cursor-pointer last:mr-0 disabled:opacity-10 disabled:cursor-default dark:disabled:bg-white dark:disabled:text-black dark:disabled:opacity-40 ${sizeClass}`}
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

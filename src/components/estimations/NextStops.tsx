import React from "react";
import { Fragment } from "react";
import { getLineBackgroundColors } from "../../utils/LineUtils";

interface NextStopsProps {
  label: string;
  list: readonly string[];
}

function NextStops({ label, list }: NextStopsProps): React.JSX.Element {
  const backgroundColors = getLineBackgroundColors(label);

  return (
    <Fragment>
      <div
        className="rounded-b-[30px] py-1.5 bg-[var(--bg)]"
        style={{
          "--bg": backgroundColors[1],
          "--border": backgroundColors[0],
        }}
      >
        {list.map((stop, i) => {
          return (
            <div
              key={i}
              className="border-b border-[var(--border)] last:border-b-0 mx-6 py-3"
            >
              {stop}
            </div>
          );
        })}
      </div>
    </Fragment>
  );
}

export default NextStops;

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
        className="rounded-b-7.5 py-1.5"
        style={{
          "--background": backgroundColors[1],
          "--border-color": backgroundColors[0],
          background: backgroundColors[1],
        } as React.CSSProperties}
      >
        {list.map((stop, i) => {
          return (
            <div
              key={i}
              className="border-b border-solid mx-6 py-3 last:border-b-0"
              style={{
                borderColor: backgroundColors[0],
                opacity: 0.4,
              }}
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

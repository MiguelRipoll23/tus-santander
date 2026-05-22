import React from "react";
import { Fragment } from "react";
import { getLineBackgroundColors } from "../../utils/LineUtils";
import styles from "./NextStops.module.css";

interface NextStopsProps {
  label: string;
  list: readonly string[];
}

function NextStops({ label, list }: NextStopsProps): React.JSX.Element {
  const backgroundColors = getLineBackgroundColors(label);

  return (
    <Fragment>
      <div
        className={styles.NextStops}
        style={{
          "--background": backgroundColors[1],
          "--border-color": backgroundColors[0],
        }}
      >
        {list.map((stop) => {
          return (
            <div key={stop} className={styles.NextStop}>
              {stop}
            </div>
          );
        })}
      </div>
    </Fragment>
  );
}

export default NextStops;

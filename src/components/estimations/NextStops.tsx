import { Fragment } from "react";
import { getLineBackgroundColors } from "../../utils/LineUtils";
import styles from "./NextStops.module.css";

const NextStopsCard = (props) => {
  const { label } = props;
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
        {props.list.map((stop, i) => {
          return (
            <div key={i} className={styles.NextStop}>
              {stop}
            </div>
          );
        })}
      </div>
    </Fragment>
  );
};

export default NextStopsCard;

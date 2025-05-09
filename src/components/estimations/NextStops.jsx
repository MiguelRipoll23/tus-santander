import { Fragment } from "react";
import { getLineBackgroundColors } from "../../utils/LineUtils.jsx";
import Styles from "./NextStops.module.css";

const NextStopsCard = (props) => {
  const { label } = props;
  const backgroundColors = getLineBackgroundColors(label);

  return (
    <Fragment>
      <div
        className={Styles.NextStops}
        style={{ background: backgroundColors[1] }}
      >
        {props.list.map((stop, i) => {
          return (
            <div
              key={i}
              className={Styles.NextStop}
              style={{ borderColor: backgroundColors[0] }}
            >
              {stop}
            </div>
          );
        })}
      </div>
    </Fragment>
  );
};

export default NextStopsCard;

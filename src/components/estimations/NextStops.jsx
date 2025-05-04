import { Fragment } from "react";
import styles from "./NextStops.module.css";

import { getLineBackgroundColors } from "../../utils/LineUtils.jsx";

const NextStopsCard = (props) => {
  const { label } = props;
  const backgroundColors = getLineBackgroundColors(label);

  return (
    <Fragment>
      <div className={styles.NextStopsStyled} style={{ background: backgroundColors[1] }}>
        {props.list.map((stop, i) => {
          return (
            <div key={i} className={styles.NextStopStyled} style={{ borderBottom: `1px solid ${backgroundColors[0]}` }}>
              {stop}
            </div>
          );
        })}
      </div>
    </Fragment>
  );
};

export default NextStopsCard;

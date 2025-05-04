import styles from "./StopLines.module.css";

import StyleUtils from "../utils/StyleUtils.jsx";
import {
  getLineBackgroundColor,
  getLineTextColor,
} from "../utils/LineUtils.jsx";

const isDisabled = (label, estimations) => {
  // Check if coming from route view
  if (estimations === undefined) {
    return false;
  }

  for (const item of estimations) {
    const [etaLabel] = item;

    if (label === etaLabel) {
      return false;
    }
  }

  return true;
};

const handleOnClick = (label) => {
  const labelElement = document.querySelector(`#label-${label}`);
  labelElement?.scrollIntoView({ behavior: "smooth", block: "center" });
};

const StopLines = (props) => {
  return (
    <div className={styles.StopLinesStyled} size={props.size}>
      {props.list.map((label, i) => {
        return (
          <button
            key={i}
            className={styles.StopLineStyled}
            size={props.size}
            style={{
              backgroundColor: getLineBackgroundColor(label, "string"),
              color: getLineTextColor(label),
            }}
            disabled={isDisabled(label, props.estimations)}
            onClick={() => handleOnClick(label)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default StopLines;

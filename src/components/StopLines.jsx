import styles from "./StopLines.module.css";

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
    <div
      className={styles.StopLinesStyled}
      style={{
        paddingLeft: props.size === "small" ? "0" : `var(--margin-lr)`,
        height: props.size === "small" ? "28px" : "36px",
      }}
    >
      {props.list.map((label, i) => {
        return (
          <button
            key={i}
            className={styles.StopLineStyled}
            style={{
              backgroundColor: getLineBackgroundColor(label, "string"),
              color: getLineTextColor(label),
              fontSize: props.size === "small" ? "12px" : "18px",
              marginRight: props.size === "small" ? "5px" : "7px",
              minWidth: props.size === "small" ? "35px" : "48px",
              padding: props.size === "small" ? "2px 0" : "6px 0",
              cursor: props.size === "small" ? "default" : "pointer",
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

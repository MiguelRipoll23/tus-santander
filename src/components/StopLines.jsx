import Styles from "./StopLines.module.css";

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
    <div className={Styles.StopLines}>
      {props.list.map((label, i) => {
        return (
          <button
            key={i}
            className={Styles.StopLine}
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

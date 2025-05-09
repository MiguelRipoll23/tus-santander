import styles from "./StopLines.module.css";
import StyleUtils from "../utils/StyleUtils.jsx";
import {
  getLineBackgroundColor,
  getLineTextColor,
} from "../utils/LineUtils.jsx";

const isDisabled = (label, estimations) => {
  if (estimations === undefined) return false;

  for (const item of estimations) {
    const [etaLabel] = item;
    if (label === etaLabel) return false;
  }

  return true;
};

const handleOnClick = (label) => {
  const labelElement = document.querySelector(`#label-${label}`);
  labelElement?.scrollIntoView({ behavior: "smooth", block: "center" });
};

const StopLines = ({ size, list, estimations }) => {
  const isSmall = size === "small";
  const height = isSmall ? "28px" : "36px";
  const paddingLeft = isSmall ? "0" : StyleUtils.MARGIN_LR;

  return (
    <div
      className={styles.stopLines}
      style={{
        "--padding-left": paddingLeft,
        "--margin-lr": StyleUtils.MARGIN_LR,
        "--height": height,
      }}
    >
      {list.map((label, i) => {
        const isDisabledBtn = isDisabled(label, estimations);
        const buttonClass = `${styles.stopLine} ${
          isSmall ? styles.stopLineSmall : styles.stopLineLarge
        }`;

        return (
          <button
            key={i}
            className={buttonClass}
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
};

export default StopLines;

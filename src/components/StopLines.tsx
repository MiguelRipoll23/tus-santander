import styles from "./StopLines.module.css";
import {
  getLineBackgroundColor,
  getLineTextColor,
} from "../utils/LineUtils";

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
  const paddingLeft = isSmall ? "0" : "var(--margin-lr)";

  return (
    <div
      className={styles.stopLines}
      style={{
        "--padding-left": paddingLeft,
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

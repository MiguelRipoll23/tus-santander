import styles from "./EstimationsCard.module.css";

import {
  getLineBackgroundColors,
  getLineTextColor,
} from "../../utils/LineUtils";

const EstimationsCard = (props) => {
  const { label } = props;
  const backgroundColors = getLineBackgroundColors(label);
  const textColor = getLineTextColor(label);

  return (
    <div
      id={props.id}
      className={styles.EstimationsCard}
      style={{
        background: `linear-gradient(to bottom, ${backgroundColors[0]}, ${backgroundColors[1]})`,
        color: textColor,
      }}
      onClick={props.onClick}
    >
      {props.children}
    </div>
  );
};

export default EstimationsCard;

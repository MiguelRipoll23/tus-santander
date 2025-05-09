import styles from "./EstimationsCard.module.css";
import StyleUtils from "../../utils/StyleUtils.jsx";

import {
  getLineBackgroundColors,
  getLineTextColor,
} from "../../utils/LineUtils.jsx";

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
        marginLeft: StyleUtils.MARGIN_LR,
        marginRight: StyleUtils.MARGIN_LR,
      }}
      onClick={props.onClick}
    >
      {props.children}
    </div>
  );
};

export default EstimationsCard;

import styled from "styled-components";
import StyleUtils from "../../utils/StyleUtils.js";

import {
  getLineBackgroundColors,
  getLineTextColor,
} from "../../utils/LineUtils.js";

const EstimationsCardStyled = styled.div`
  border-radius: 30px;
  margin-top: 14px;
  margin-left: ${StyleUtils.MARGIN_LR};
  margin-right: ${StyleUtils.MARGIN_LR};
  cursor: pointer;
  color: ${(props) => props.$textColor};
  background: linear-gradient(
    to bottom,
    ${(props) => props.$backgroundColors[0]},
    ${(props) => props.$backgroundColors[1]}
  );
  animation: fade-in 0.3s;

  &:last-child {
    margin-bottom: 14px;
  }
`;

const EstimationsCard = (props) => {
  const { label } = props;
  const backgroundColors = getLineBackgroundColors(label);
  const textColor = getLineTextColor(label);

  return (
    <EstimationsCardStyled
      id={props.id}
      $backgroundColors={backgroundColors}
      $textColor={textColor}
      onClick={props.onClick}
    >
      {props.children}
    </EstimationsCardStyled>
  );
};

export default EstimationsCard;

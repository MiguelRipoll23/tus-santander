import { Fragment } from "react";
import styled from "styled-components";

import { getLineBackgroundColors } from "../../utils/LineUtils.js";

const NextStopsStyled = styled.div`
  background: ${(props) => props.$backgroundColors[1]};
  border-radius: 0 0 30px 30px;
  padding: 6px 0;
`;

const NextStopStyled = styled.div`
  border-bottom: 1px solid ${(props) => props.$backgroundColors[0]};
  border-bottom-opacity: 0.4;
  margin: 0 24px;
  padding: 12px 0;

  &:last-child {
    border-bottom: 0;
  }
`;

const NextStopsCard = (props) => {
  const { label } = props;
  const backgroundColors = getLineBackgroundColors(label);

  return (
    <Fragment>
      <NextStopsStyled $backgroundColors={backgroundColors}>
        {props.list.map((stop, i) => {
          return (
            <NextStopStyled key={i} $backgroundColors={backgroundColors}>
              {stop}
            </NextStopStyled>
          );
        })}
      </NextStopsStyled>
    </Fragment>
  );
};

export default NextStopsCard;

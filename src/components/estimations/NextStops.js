import { Fragment } from "react";
import styled from "styled-components";

const NextStopsStyled = styled.div`
  background: ${(props) => props.colors[0]};
  border-radius: 0 0 30px 30px;
  padding: 6px 0;
`;

const NextStopStyled = styled.div`
  border-bottom: 1px solid ${(props) => props.colors[1]};
  border-bottom-opacity: 0.4;
  margin: 0 24px;
  padding: 12px 0;

  &:last-child {
    border-bottom: 0;
  }
`;

const NextStopsCard = (props) => {
  return (
    <Fragment>
      <NextStopsStyled colors={props.colors}>
        {props.list.map((stop, i) => {
          return (
            <NextStopStyled key={i} colors={props.colors}>
              {stop}
            </NextStopStyled>
          );
        })}
      </NextStopsStyled>
    </Fragment>
  );
};

export default NextStopsCard;

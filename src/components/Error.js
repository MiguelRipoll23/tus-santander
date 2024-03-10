import styled from "styled-components";

import Button from "./Button.js";

const ErrorStyled = styled.div`
  text-align: center;
  position: fixed;
  top: calc(50% - (84px / 2));
  width: 100%;
  padding: 0 80px;
  box-sizing: border-box;
  display: inline-block;
  animation: "fade-in 0.2s";
`;

const TextStyled = styled.div`
  margin-bottom: 14px;
`;

const Error = (props) => {
  return (
    <ErrorStyled>
      <TextStyled>{props.errorText}</TextStyled>
      <Button color="var(--color-light-blue)" onClick={props.retryAction}>
        {props.retryText}
      </Button>
    </ErrorStyled>
  );
};

export default Error;

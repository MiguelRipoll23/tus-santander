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
  animation: ${(props) =>
    props.animation === undefined ? "fade-in 0.2s" : props.animation};
`;

const TextStyled = styled.div`
  margin-bottom: 14px;
`;

const Error = (props) => {
  console.log(props.animation);
  console.log(props.animation === undefined || props.animation === true);
  return (
    <ErrorStyled animation={props.animation}>
      {props.error_text_lowercase === undefined && (
        <TextStyled>{props.error_text.toUpperCase()}</TextStyled>
      )}
      {props.error_text_lowercase !== undefined && (
        <TextStyled>{props.error_text}</TextStyled>
      )}
      <Button color="rgb(0, 122, 255)" onClick={props.retry_action}>
        {props.retry_text}
      </Button>
    </ErrorStyled>
  );
};

export default Error;

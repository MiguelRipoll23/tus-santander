import styled from "styled-components";

const ButtonStyled = styled.button`
  background: ${(props) => props.color};
  border-radius: 30px;
  padding: 16px 22px;
  text-align: center;
  color: #fff;
  font-weight: bold;
  display: inline-block;

  @media (prefers-color-scheme: dark) {
    background: #1c1b20;
  }
`;

const Button = (props) => {
  return (
    <ButtonStyled
      className={props.className}
      color={props.color}
      onClick={props.onClick}
    >
      {props.children}
    </ButtonStyled>
  );
};

export default Button;

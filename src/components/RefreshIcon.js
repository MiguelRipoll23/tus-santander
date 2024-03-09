import styled from "styled-components";

const RefreshIconStyled = styled.button`
  font-family: icons;
  font-size: 32px;
  color: #fff;
  background: var(--color-blue);
  position: fixed;
  border-radius: 100%;
  width: 80px;
  height: 80px;
  left: 50%;
  margin-left: -40px;
  animation: fade-in 0.2s;
  line-height: 80px;
  bottom: 30px;

  & span {
    position: relative;
    top: -5px;
  }
`;

const RefreshIcon = (props) => {
  return (
    <RefreshIconStyled aria-label="Refrescar" onClick={props.refreshContent}>
      <span></span>
    </RefreshIconStyled>
  );
};

export default RefreshIcon;

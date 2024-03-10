import styled from "styled-components";

const RefreshIconStyled = styled.button`
  font-family: icons;
  font-size: 34px;
  color: #fff;
  background: var(--color-blue);
  position: fixed;
  border-radius: 100%;
  width: 74px;
  height: 74px;
  left: 50%;
  margin-left: -37px;
  animation: fade-in 0.2s;
  line-height: 74px;
  bottom: 28px;

  & span {
    position: relative;
    top: -2px;
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

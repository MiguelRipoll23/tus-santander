import styled from "styled-components";

const RefreshIconStyled = styled.button`
  font-family: icons;
  font-size: 32px;
  color: #fff;
  background: var(--color-blue);
  position: fixed;
  border-radius: 100%;
  width: 75px;
  height: 75px;
  left: 50%;
  margin-left: -25px;
  animation: fade-in 0.2s;
  line-height: 75px;
  bottom: 60px;
`;

const RefreshIcon = (props) => {
  return (
    <RefreshIconStyled aria-label="Refrescar" onClick={props.refreshContent}>
      
    </RefreshIconStyled>
  );
};

export default RefreshIcon;

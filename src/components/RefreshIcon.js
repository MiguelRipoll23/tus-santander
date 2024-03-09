import styled from "styled-components";

const RefreshIconStyled = styled.button`
  font-family: icons;
  font-size: 32px;
  color: #fff;
  background: var(--color-blue);
  position: fixed;
  border-radius: 100%;
  width: 65px;
  height: 65px;
  left: 50%;
  margin-left: -25px;
  animation: fade-in 0.2s;
  bottom: 20px;
`;

const RefreshIcon = (props) => {
  return (
    <RefreshIconStyled aria-label="Refrescar" onClick={props.refreshContent}>
      
    </RefreshIconStyled>
  );
};

export default RefreshIcon;

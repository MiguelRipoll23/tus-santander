import styled from "styled-components";

import StyleUtils from "../utils/StyleUtils.js";

const RefreshIconStyled = styled.button`
  padding: 11px ${StyleUtils.MARGIN_LR};
  font-family: icons;
  font-size: 24px;
  color: #007aff;
  line-height: 24px;
  position: relative;
  top: 1px;
  animation: fade-in 0.2s;
`;

const RefreshIcon = (props) => {
  return (
    <RefreshIconStyled aria-label="Refrescar" onClick={props.refreshContent}>
      
    </RefreshIconStyled>
  );
};

export default RefreshIcon;

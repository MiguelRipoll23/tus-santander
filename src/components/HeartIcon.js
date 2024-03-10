import styled from "styled-components";

import StyleUtils from "../utils/StyleUtils.js";

const HeartIconStyled = styled.button`
  padding: 11px ${StyleUtils.MARGIN_LR};
  font-family: icons;
  font-size: 24px;
  color: #ff2d55;
  line-height: 24px;
  position: relative;
  top: -1px;
  padding-top: 14px;
  padding-bottom: 8px;
  animation: fade-in 0.2s;

  &:after {
    content: "${(props) => (props.$state > 1 ? "\\e903" : "\\e904")}";
  }
`;

const HeartIcon = (props) => {
  return (
    <HeartIconStyled
      aria-label="Añadir a favoritos"
      $state={props.heartState}
      onClick={props.updateFavorite}
    />
  );
};

export default HeartIcon;

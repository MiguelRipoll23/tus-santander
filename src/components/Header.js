import styled from "styled-components";

import StyleUtils from "../utils/StyleUtils.js";

const HeaderStyled = styled.div`
  padding-left: ${StyleUtils.MARGIN_LR};
  padding-right: ${StyleUtils.MARGIN_LR};
  padding-bottom: 5px;
`;

const OptionsStyled = styled.div`
  box-sizing: border-box;
  padding-top: 8px;
  height: 42px;
  text-align: right;
`;

const TitleStyled = styled.div`
  font-weight: bold;
  font-size: 35px;
`;

const Header = (props) => {
  return (
    <HeaderStyled>
      <OptionsStyled>{props.children}</OptionsStyled>
      <TitleStyled>{props.text}</TitleStyled>
    </HeaderStyled>
  );
};

export default Header;

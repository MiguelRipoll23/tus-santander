import styled from "styled-components";

import StyleUtils from "../utils/StyleUtils.js";

const HeaderStyled = styled.div`
  padding-left: ${StyleUtils.MARGIN_LR};
  padding-right: ${StyleUtils.MARGIN_LR};
  padding-bottom: 5px;

  @media (min-width: 500px) {
    display: none;
  }
`;

const EditStyled = styled.div`
  box-sizing: border-box;
  padding-top: 12px;
  height: 44px;
  cursor: pointer;
  text-align: right;
  color: rgb(0, 122, 255);

  & span {
    align-self: flex-end;
  }
`;

const TitleStyled = styled.div`
  font-weight: bold;
  font-size: 35px;
`;

const Header = (props) => {
  return (
    <HeaderStyled>
      <EditStyled>
        <span onClick={props.enterEditMode}>Editar</span>
      </EditStyled>
      <TitleStyled>{props.text}</TitleStyled>
    </HeaderStyled>
  );
};

export default Header;

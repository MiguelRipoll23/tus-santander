import styled from "styled-components";

import { useView } from "../../contexts/ViewContext.js";
import * as ViewConstants from "../../constants/ViewConstants.js";

const HomeMenuStyled = styled.div`
  background: #f7f7f7;
  border-top: 1px solid rgba(0, 0, 0, 0.15);
  align-items: center;
  display: flex;
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 9;

  @media (prefers-color-scheme: dark) {
    background: #1c1b20;
    border-top: none;
  }
`;

const Item = styled.div`
  float: left;
  width: 100px;
  text-align: center;
  flex: 1;
  cursor: pointer;
  padding-top: 14px;
  padding-bottom: calc(24px + env(safe-area-inset-bottom));

  color: ${(props) => (props.selected ? "#007aff" : "rgba(0, 0, 0, .55);")};

  @media (prefers-color-scheme: dark) {
    color: ${(props) =>
      props.selected ? "#007aff" : "rgba(255, 255, 255, .55);"};
  }
`;

const ItemIcon = styled.div`
  font-size: 24px;
  font-family: icons;
  margin-bottom: 5px;
`;

const ItemText = styled.div`
  line-height: 19px;
`;

const HomeMenu = (props) => {
  const { setViewId, subViewId, setSubViewId } = useView();

  const loadFavoritesSubView = () => {
    setSubViewId(ViewConstants.SUB_VIEW_ID_FAVORITES);
  };

  const loadMapSubView = () => {
    setViewId(ViewConstants.VIEW_ID_MAP);
  };

  const loadSearchSubView = () => {
    setSubViewId(ViewConstants.SUB_VIEW_ID_SEARCH);
  };

  return (
    <HomeMenuStyled>
      <Item
        selected={subViewId === ViewConstants.SUB_VIEW_ID_FAVORITES}
        onClick={loadFavoritesSubView}
      >
        <ItemIcon></ItemIcon>
        <ItemText>Favoritos</ItemText>
      </Item>
      <Item
        selected={subViewId === ViewConstants.SUB_VIEW_ID_MAP}
        onClick={loadMapSubView}
      >
        <ItemIcon></ItemIcon>
        <ItemText>Mapa</ItemText>
      </Item>
      <Item
        selected={subViewId === ViewConstants.SUB_VIEW_ID_SEARCH}
        onClick={loadSearchSubView}
      >
        <ItemIcon></ItemIcon>
        <ItemText>Buscar</ItemText>
      </Item>
    </HomeMenuStyled>
  );
};

export default HomeMenu;

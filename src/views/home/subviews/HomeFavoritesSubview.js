import { Fragment, useState, useEffect } from "react";
import styled from "styled-components";

import { useView } from "../../../contexts/ViewContext.js";
import StyleUtils from "../../../utils/StyleUtils.js";
import { getFavorites, saveFavorites } from "../../../utils/FavoriteUtils.js";
import {
  VIEW_ID_MAP,
  VIEW_ID_ESTIMATIONS_STOP,
} from "../../../constants/ViewConstants.js";

import Nav from "../../../components/Nav.js";
import Error from "../../../components/Error.js";
import HomeDesktop from "../../../components/home/HomeDesktop.js";

const SortIconAndDoneLinkStyled = styled.button`
  color: var(--color-blue);
  align-self: flex-end;
  padding: 0 0px;
  font-family: ${(props) => (props.$editMode ? "revert" : "icons")};
  font-size: ${(props) => (props.$editMode ? "inherit" : "24px")};
`;

const ContentStyled = styled.div`
  position: relative;
  height: calc(100% - 91px + env(safe-area-inset-bottom));
  overflow-y: auto;
  padding-top: 3px;
  padding-bottom: 14px;
  box-sizing: border-box;
`;

const FavoriteStyled = styled.button`
  padding: 13px 22px;
  background: linear-gradient(to right, #ff2e56, #e0002b);
  color: #fff;
  font-size: 16px;
  box-sizing: border-box;
  line-height: 27px;
  border-radius: 14px;
  margin: 0 ${StyleUtils.MARGIN_LR};
  margin-bottom: 8px;
  overflow: hidden;
  font-weight: 700;
  min-height: 53px;
  width: calc(100% - 28px);
  text-align: left;
  -webkit-user-select: none;
  user-select: none;

  &.over {
    padding: 11px 20px;
    border: 2px dashed #ff2e56;
    background: none;
    color: #ff2e56;
  }

  @media (prefers-color-scheme: dark) {
    background: #1c1b20;
  }
`;

const HomeFavoritesSubview = (props) => {
  const { setViewId, setViewIdWithData } = useView();

  const [error, setError] = useState(false);
  const [favorites, setFavorites] = useState([]);

  // Edit mode
  const [editMode, setEditMode] = useState(false);
  const [sortIconHidden, setSortIconHidden] = useState(true);

  const toggleEditMode = () => {
    setEditMode(editMode ? false : true);
  };

  // Drag & Drop
  let draggingElement = null;

  const handleDragEnter = (event) => {
    event.target.classList.add("over");
  };

  const handleDragLeave = (event) => {
    event.target.classList.remove("over");
  };

  const handleDragStart = (event) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", event.target.innerText);
    draggingElement = event.target;
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";

    return false;
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const targetElement = event.target;
    targetElement.classList.remove("over");

    if (draggingElement === targetElement) {
      return;
    }

    const favoritesOrdered = [...favorites];
    const childrenArray = [...draggingElement.parentNode.children];

    const sourceIndex = childrenArray.indexOf(draggingElement);
    const targetIndex = childrenArray.indexOf(targetElement);

    const [movedItem] = favoritesOrdered.splice(sourceIndex, 1);
    
    const isSourceIndexLessThanTarget = sourceIndex < targetIndex;
    const isTargetNotAtEnd = targetIndex !== favoritesOrdered.length;
    const adjustedTargetIndex = isSourceIndexLessThanTarget && isTargetNotAtEnd ? targetIndex - 1 : targetIndex;
    
    favoritesOrdered.splice(adjustedTargetIndex, 0, movedItem);

    setFavorites(favoritesOrdered);
    saveFavorites(favoritesOrdered);

    return false;
  };

  // View handlers
  const loadMapSubview = () => {
    setViewId(VIEW_ID_MAP);
  };

  const loadEstimationsStopView = (favorite) => {
    if (editMode) {
      return;
    }

    setViewIdWithData(VIEW_ID_ESTIMATIONS_STOP, {
      stopId: favorite.stop_id,
      stopName: favorite.stop_name,
    });
  };

  // Content
  const isDesktop = window.innerWidth >= 1000;

  const Content = (props) => {
    if (isDesktop) {
      return <HomeDesktop />;
    } else {
      return (
        <Fragment>
          <Nav isHeader={true} titleText="Favoritos" hidden={isDesktop}>
            <SortIconAndDoneLinkStyled
              $editMode={editMode}
              hidden={sortIconHidden}
              onClick={toggleEditMode}
            >
              {editMode ? "Hecho" : ""}
            </SortIconAndDoneLinkStyled>
          </Nav>
          <ContentStyled hidden={isDesktop}>
            {error && (
              <Error
                errorText="Usa el mapa o el buscador para añadir paradas"
                retryText="Ver paradas cercanas"
                retryAction={loadMapSubview}
                animation="none"
              />
            )}
            {favorites.map((favorite, i) => {
              return (
                <FavoriteStyled
                  key={i}
                  draggable={editMode}
                  onClick={() => loadEstimationsStopView(favorite)}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {favorite.stop_name}
                </FavoriteStyled>
              );
            })}
          </ContentStyled>
        </Fragment>
      );
    }
  };

  // Mount
  useEffect(() => {
    const favorites = getFavorites();

    if (favorites.length === 0) {
      setError(true);
    } else {
      setSortIconHidden(false);
      setFavorites(favorites);
    }
  }, []);

  return <Content />;
};

export default HomeFavoritesSubview;

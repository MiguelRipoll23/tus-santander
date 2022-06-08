import { Fragment, useState, useEffect } from "react";
import styled from "styled-components";

import { useView } from "../../../contexts/ViewContext.js";
import * as ViewConstants from "../../../constants/ViewConstants.js";

import StyleUtils from "../../../utils/StyleUtils.js";
import { getFavorites } from "../../../utils/FavoriteUtils.js";

import Error from "../../../components/Error.js";
import HomeDesktop from "../../../components/home/HomeDesktop.js";

const ViewportStyled = styled.div`
  position: relative;
  height: calc(100% - 91px + env(safe-area-inset-bottom));
  overflow-y: auto;
  padding-bottom: 14px;
  box-sizing: border-box;
`;

const FavoriteStyled = styled.div`
  padding: 13px 22px;
  background: linear-gradient(to right, #ff2e56, #e0002b);
  color: #fff;
  cursor: pointer;
  font-size: 16px;
  box-sizing: border-box;
  line-height: 27px;
  border-radius: 14px;
  margin: 0 ${StyleUtils.MARGIN_LR};
  margin-bottom: 8px;
  overflow: hidden;
  font-weight: 700;
  min-height: 53px;

  @media (prefers-color-scheme: dark) {
    background: #1c1b20;
  }
`;

const HomeFavoritesSubview = (props) => {
  const { updateTitleText } = props;

  const { setViewId, setViewIdWithData } = useView();

  const [error, setError] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const loadMapSubview = () => {
    setViewId(ViewConstants.VIEW_ID_MAP);
  };

  const loadEstimationsStopView = (favorite) => {
    setViewIdWithData(ViewConstants.VIEW_ID_ESTIMATIONS_STOP, {
      stopId: favorite.stop_id,
      stopName: favorite.stop_name,
    });
  };

  useEffect(() => {
    const favorites = getFavorites();

    if (favorites.length === 0) {
      setError(true);
    } else {
      setFavorites(favorites);
    }
  }, []);

  // Mount
  useEffect(() => {
    updateTitleText(ViewConstants.SUB_VIEW_TITLE_FAVORITES);
  }, [updateTitleText]);

  return (
    <Fragment>
      <ViewportStyled>
        {error && (
          <Error
            error_text="Usa el mapa o el buscador para añadir paradas"
            error_text_lowercase={true}
            retry_text="Ver paradas cercanas"
            retry_action={loadMapSubview}
            animation="none"
          />
        )}
        {favorites.map((favorite, i) => {
          return (
            <FavoriteStyled
              key={i}
              onClick={() => loadEstimationsStopView(favorite)}
            >
              {favorite.stop_name}
            </FavoriteStyled>
          );
        })}
      </ViewportStyled>
      <HomeDesktop />
    </Fragment>
  );
};

export default HomeFavoritesSubview;

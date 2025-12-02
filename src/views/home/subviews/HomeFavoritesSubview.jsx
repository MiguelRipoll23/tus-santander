import { Fragment, useEffect, useState } from "react";

import { useView } from "../../../contexts/ViewContext.jsx";
import { getFavorites, saveFavorites } from "../../../utils/FavoriteUtils.jsx";
import {
  VIEW_ID_ESTIMATIONS_STOP,
  VIEW_ID_MAP,
} from "../../../constants/ViewConstants.jsx";
import { sendTelemetryEvent } from "../../../utils/TelemetryUtils.jsx";

import Nav from "../../../components/Nav.jsx";
import Error from "../../../components/Error.jsx";
import HomeDesktop from "../../../components/home/HomeDesktop.jsx";
import { useI18n } from "../../../contexts/I18nContext.jsx";
import styles from "./HomeFavoritesSubview.module.css";

const HomeFavoritesSubview = () => {
  const { getText } = useI18n();
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
    event.target.classList.add(styles.over);
  };

  const handleDragLeave = (event) => {
    event.target.classList.remove(styles.over);
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
    targetElement.classList.remove(styles.over);

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
    const adjustedTargetIndex =
      isSourceIndexLessThanTarget && isTargetNotAtEnd
        ? targetIndex - 1
        : targetIndex;

    favoritesOrdered.splice(adjustedTargetIndex, 0, movedItem);

    setFavorites(favoritesOrdered);
    saveFavorites(favoritesOrdered);

    // Track favorite reorder
    sendTelemetryEvent("favorite_reorder", {
      from_pos: sourceIndex,
      to_pos: adjustedTargetIndex,
    });

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

    // Track favorite selection
    sendTelemetryEvent("favorite_select", {
      stop_id: favorite.stop_id,
    });

    setViewIdWithData(VIEW_ID_ESTIMATIONS_STOP, {
      stopId: favorite.stop_id,
      stopName: favorite.stop_name,
    });
  };

  // Content
  const isDesktop = globalThis.innerWidth >= 1000;

  const Content = () => {
    if (isDesktop) {
      return <HomeDesktop />;
    } else {
      const fontFamily = editMode ? "revert" : "icons";
      const fontSize = editMode ? "inherit" : "24px";

      return (
        <Fragment>
          <Nav isHeader titleText={getText("favorites")} hidden={isDesktop}>
            <button
              type="button"
              className={styles.SortIconAndDoneLink}
              style={{ fontFamily, fontSize }}
              hidden={sortIconHidden}
              onClick={toggleEditMode}
            >
              {editMode ? getText("done") : ""}
            </button>
          </Nav>
          <div className={styles.Content} hidden={isDesktop}>
            {error && (
              <Error
                errorText={getText("use_map_or_search")}
                retryText={getText("see_nearby_stops")}
                retryAction={loadMapSubview}
                animation="none"
              />
            )}
            {favorites.map((favorite, i) => {
              return (
                <button
                  type="button"
                  key={i}
                  className={styles.Favorite}
                  draggable={editMode}
                  onClick={() => loadEstimationsStopView(favorite)}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {favorite.stop_name}
                </button>
              );
            })}
          </div>
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

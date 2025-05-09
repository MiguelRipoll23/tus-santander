import Styles from "./HomeMenu.module.css";

import { useView } from "../../contexts/ViewContext.jsx";
import {
  SUB_VIEW_ID_FAVORITES,
  SUB_VIEW_ID_MAP,
  SUB_VIEW_ID_SEARCH,
  VIEW_ID_MAP,
} from "../../constants/ViewConstants.jsx";

const HomeMenu = (props) => {
  const { setViewId, subViewId, setSubViewId } = useView();

  const loadFavoritesSubView = () => {
    setSubViewId(SUB_VIEW_ID_FAVORITES);
  };

  const loadMapSubView = () => {
    setViewId(VIEW_ID_MAP);
  };

  const loadSearchSubView = () => {
    setSubViewId(SUB_VIEW_ID_SEARCH);
  };

  return (
    <div className={Styles.HomeMenu}>
      <div
        className={`${Styles.Item} ${
          subViewId === SUB_VIEW_ID_FAVORITES ? Styles.selected : ""
        }`}
        onClick={loadFavoritesSubView}
      >
        <div className={Styles.ItemIcon}></div>
        <div className={Styles.ItemText}>Favoritos</div>
      </div>
      <div
        className={`${Styles.Item} ${
          subViewId === SUB_VIEW_ID_MAP ? Styles.selected : ""
        }`}
        onClick={loadMapSubView}
      >
        <div className={Styles.ItemIcon}></div>
        <div className={Styles.ItemText}>Mapa</div>
      </div>
      <div
        className={`${Styles.Item} ${
          subViewId === SUB_VIEW_ID_SEARCH ? Styles.selected : ""
        }`}
        onClick={loadSearchSubView}
      >
        <div className={Styles.ItemIcon}></div>
        <div className={Styles.ItemText}>Buscar</div>
      </div>
    </div>
  );
};

export default HomeMenu;

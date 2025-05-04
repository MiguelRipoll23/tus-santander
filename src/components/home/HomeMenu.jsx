import styles from "./HomeMenu.module.css";

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
    <div className={styles.HomeMenuStyled}>
      <div
        className={`${styles.Item} ${subViewId === SUB_VIEW_ID_FAVORITES ? styles.selected : ""}`}
        onClick={loadFavoritesSubView}
      >
        <div className={styles.ItemIcon}></div>
        <div className={styles.ItemText}>Favoritos</div>
      </div>
      <div
        className={`${styles.Item} ${subViewId === SUB_VIEW_ID_MAP ? styles.selected : ""}`}
        onClick={loadMapSubView}
      >
        <div className={styles.ItemIcon}></div>
        <div className={styles.ItemText}>Mapa</div>
      </div>
      <div
        className={`${styles.Item} ${subViewId === SUB_VIEW_ID_SEARCH ? styles.selected : ""}`}
        onClick={loadSearchSubView}
      >
        <div className={styles.ItemIcon}></div>
        <div className={styles.ItemText}>Buscar</div>
      </div>
    </div>
  );
};

export default HomeMenu;

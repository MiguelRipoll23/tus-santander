import styles from "./HomeMenu.module.css";
import { useView } from "../../contexts/ViewContext.jsx";
import {
  SUB_VIEW_ID_FAVORITES,
  SUB_VIEW_ID_MAP,
  SUB_VIEW_ID_SEARCH,
  VIEW_ID_MAP,
} from "../../constants/ViewConstants.jsx";

const HomeMenu = () => {
  const { setViewId, subViewId, setSubViewId } = useView();

  const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const getItemClass = (selected) => {
    const base = styles.item;
    return selected
      ? `${base} ${isDark ? styles.itemSelectedDark : styles.itemSelected}`
      : base;
  };

  const menuItems = [
    {
      id: SUB_VIEW_ID_FAVORITES,
      icon: "",
      text: "Favoritos",
      onClick: () => setSubViewId(SUB_VIEW_ID_FAVORITES),
    },
    {
      id: SUB_VIEW_ID_MAP,
      icon: "",
      text: "Mapa",
      onClick: () => setViewId(VIEW_ID_MAP),
    },
    {
      id: SUB_VIEW_ID_SEARCH,
      icon: "",
      text: "Buscar",
      onClick: () => setSubViewId(SUB_VIEW_ID_SEARCH),
    },
  ];

  return (
    <div className={styles.homeMenu}>
      {menuItems.map(({ id, icon, text, onClick }) => (
        <div
          key={id}
          className={getItemClass(subViewId === id)}
          onClick={onClick}
        >
          <div className={styles.itemIcon}>{icon}</div>
          <div className={styles.itemText}>{text}</div>
        </div>
      ))}
    </div>
  );
};

export default HomeMenu;

import styles from "./HomeMenu.module.css";
import { useView } from "../../contexts/ViewContext";
import { useI18n } from "../../contexts/I18nContext";
import {
  SUB_VIEW_ID_FAVORITES,
  SUB_VIEW_ID_MAP,
  SUB_VIEW_ID_SEARCH,
  VIEW_ID_MAP,
} from "../../constants/ViewConstants";

const menuItemsData = (getText, setSubViewId, setViewId) => [
  {
    id: SUB_VIEW_ID_FAVORITES,
    icon: "",
    label: getText("favorites"),
    onClick: () => setSubViewId(SUB_VIEW_ID_FAVORITES),
  },
  {
    id: SUB_VIEW_ID_MAP,
    icon: "",
    label: getText("map"),
    onClick: () => setViewId(VIEW_ID_MAP),
  },
  {
    id: SUB_VIEW_ID_SEARCH,
    icon: "",
    label: getText("search"),
    onClick: () => setSubViewId(SUB_VIEW_ID_SEARCH),
  },
];

const HomeMenu = () => {
  const { getText } = useI18n();
  const { setViewId, subViewId, setSubViewId } = useView();
  const menuItems = menuItemsData(getText, setSubViewId, setViewId);

  return (
    <div className={styles.homeMenu}>
      {menuItems.map(({ id, icon, label, onClick }) => (
        <div
          key={id}
          className={styles.item}
          data-selected={subViewId === id}
          onClick={onClick}
        >
          <div className={styles.itemIcon}>{icon}</div>
          <div className={styles.itemText}>{label}</div>
        </div>
      ))}
    </div>
  );
};

export default HomeMenu;

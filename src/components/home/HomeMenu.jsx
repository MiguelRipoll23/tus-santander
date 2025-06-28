import styles from "./HomeMenu.module.css";
import { useView } from "../../contexts/ViewContext.jsx";
import { useI18n } from "../../contexts/I18nContext.jsx";
import {
  SUB_VIEW_ID_FAVORITES,
  SUB_VIEW_ID_MAP,
  SUB_VIEW_ID_SEARCH,
  VIEW_ID_MAP,
} from "../../constants/ViewConstants.jsx";

const menuItemsData = (t, setSubViewId, setViewId) => [
  {
    id: SUB_VIEW_ID_FAVORITES,
    icon: "",
    label: t("favorites"),
    onClick: () => setSubViewId(SUB_VIEW_ID_FAVORITES),
  },
  {
    id: SUB_VIEW_ID_MAP,
    icon: "",
    label: t("map"),
    onClick: () => setViewId(VIEW_ID_MAP),
  },
  {
    id: SUB_VIEW_ID_SEARCH,
    icon: "",
    label: t("search"),
    onClick: () => setSubViewId(SUB_VIEW_ID_SEARCH),
  },
];

const HomeMenu = () => {
  const { t } = useI18n();
  const { setViewId, subViewId, setSubViewId } = useView();
  const menuItems = menuItemsData(t, setSubViewId, setViewId);

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

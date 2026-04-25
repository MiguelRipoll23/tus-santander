import React from "react";
import type { ReactNode } from "react";
import type { SubViewId, ViewId } from "../../types/view";
import { Heart, Map, Search } from "lucide-react";
import styles from "./HomeMenu.module.css";
import { useView } from "../../contexts/ViewContext";
import { useI18n } from "../../contexts/I18nContext";
import {
  SUB_VIEW_ID_FAVORITES,
  SUB_VIEW_ID_MAP,
  SUB_VIEW_ID_SEARCH,
  VIEW_ID_MAP,
} from "../../constants/ViewConstants";

interface MenuItem {
  id: SubViewId;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}

function buildMenuItems(
  getText: (key: string) => string,
  setSubViewId: (id: SubViewId) => void,
  setViewId: (id: ViewId) => void
): MenuItem[] {
  return [
    {
      id: SUB_VIEW_ID_FAVORITES,
      icon: <Heart size={26} fill="currentColor" aria-hidden="true" />,
      label: getText("favorites"),
      onClick: () => setSubViewId(SUB_VIEW_ID_FAVORITES),
    },
    {
      id: SUB_VIEW_ID_MAP,
      icon: <Map size={26} fill="currentColor" aria-hidden="true" />,
      label: getText("map"),
      onClick: () => setViewId(VIEW_ID_MAP),
    },
    {
      id: SUB_VIEW_ID_SEARCH,
      icon: <Search size={26} aria-hidden="true" />,
      label: getText("search"),
      onClick: () => setSubViewId(SUB_VIEW_ID_SEARCH),
    },
  ];
}

function HomeMenu(): React.JSX.Element {
  const { getText } = useI18n();
  const { setViewId, subViewId, setSubViewId } = useView();
  const menuItems = buildMenuItems(getText, setSubViewId, setViewId);

  return (
    <div className={`${styles.homeMenu} liquid-glass`}>
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
}

export default HomeMenu;

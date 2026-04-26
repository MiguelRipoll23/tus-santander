import React from "react";
import type { ReactNode } from "react";
import type { SubViewId, ViewId } from "../../types/view";
import { Heart, Map, Search, Route } from "lucide-react";
import { useView } from "../../contexts/ViewContext";
import { useI18n } from "../../contexts/I18nContext";
import {
  SUB_VIEW_ID_FAVORITES,
  SUB_VIEW_ID_MAP,
  SUB_VIEW_ID_SEARCH,
  SUB_VIEW_ID_TRIP,
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
      id: SUB_VIEW_ID_TRIP,
      icon: <Route size={26} aria-hidden="true" />,
      label: getText("trip"),
      onClick: () => setSubViewId(SUB_VIEW_ID_TRIP),
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
    <div className="liquid-glass rounded-full items-center flex fixed z-9" style={{ bottom: `calc(env(safe-area-inset-bottom) + 28px)`, left: "50%", transform: "translateX(-50%)" }}>
      {menuItems.map(({ id, icon, label, onClick }) => (
        <div
          key={id}
          className={`text-center flex-1 cursor-pointer rounded-full m-1 p-1.5 px-6 transition-colors duration-200 text-black dark:text-white dark:opacity-60 ${
            subViewId === id
              ? "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500 dark:bg-opacity-10 dark:opacity-100 backdrop-blur-glass"
              : ""
          }`}
          onClick={onClick}
        >
          <div className="flex items-center justify-center mb-1.25">{icon}</div>
          <div className="leading-4.75">{label}</div>
        </div>
      ))}
    </div>
  );
}

export default HomeMenu;

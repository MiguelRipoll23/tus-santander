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
    <div className="liquid-glass rounded-[50px] items-center flex fixed bottom-[calc(env(safe-area-inset-bottom)+28px)] left-1/2 -translate-x-1/2 z-[9] dark:bg-[#1c1b20]">
      {menuItems.map(({ id, icon, label, onClick }) => (
        <div
          key={id}
          className={`text-center flex-1 cursor-pointer rounded-[50px] m-1 py-[6px] px-6 transition-[color,background-color] duration-200 ease-in-out
            ${subViewId === id
              ? "text-[#0070f0] bg-[rgba(0,112,240,0.1)] [backdrop-filter:blur(20px)_saturate(180%)]"
              : "text-black dark:text-[rgba(255,255,255,0.55)] dark:opacity-60"
            }`}
          onClick={onClick}
        >
          <div className="flex items-center justify-center mb-[5px]">{icon}</div>
          <div className="leading-[19px]">{label}</div>
        </div>
      ))}
    </div>
  );
}

export default HomeMenu;

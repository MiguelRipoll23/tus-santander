import React from "react";
import type { MouseEventHandler } from "react";
import { Heart } from "lucide-react";
import { useI18n } from "../contexts/I18nContext";

interface HeartIconProps {
  heartState: number;
  updateFavorite: MouseEventHandler<HTMLButtonElement>;
}

function HeartIcon(
  { heartState, updateFavorite }: HeartIconProps,
): React.JSX.Element {
  const { getText } = useI18n();
  const isFavorite = heartState > 1;
  return (
    <button
      className="liquid-glass text-rose-500 relative -top-0.25 p-2 m-2.75 animate-fade-in flex items-center justify-center"
      aria-label={getText("add_to_favorites")}
      onClick={updateFavorite}
    >
      <Heart
        size={26}
        fill={isFavorite ? "currentColor" : "none"}
        aria-hidden="true"
      />
    </button>
  );
}

export default HeartIcon;

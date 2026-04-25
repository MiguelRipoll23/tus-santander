import React from "react";
import type { MouseEventHandler } from "react";
import { Heart } from "lucide-react";
import styles from "./HeartIcon.module.css";
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
      className={`${styles.HeartIcon} liquid-glass`}
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

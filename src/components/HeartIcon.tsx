import React from "react";
import type { MouseEventHandler } from "react";
import styles from "./HeartIcon.module.css";
import { useI18n } from "../contexts/I18nContext";

interface HeartIconProps {
  heartState: number;
  updateFavorite: MouseEventHandler<HTMLButtonElement>;
}

function HeartIcon({ heartState, updateFavorite }: HeartIconProps): React.JSX.Element {
  const { getText } = useI18n();
  return (
    <button
      className={`${styles.HeartIcon} liquid-glass`}
      aria-label={getText("add_to_favorites")}
      data-state={heartState > 1 ? "❤️" : "🤍"}
      onClick={updateFavorite}
    />
  );
}

export default HeartIcon;

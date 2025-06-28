import styles from "./HeartIcon.module.css";
import { useI18n } from "../contexts/I18nContext.jsx";

const HeartIcon = (props) => {
  const { t } = useI18n();
  return (
    <button
      className={styles.HeartIcon}
      aria-label={t("add_to_favorites")}
      data-state={props.heartState > 1 ? "" : ""}
      onClick={props.updateFavorite}
    />
  );
};

export default HeartIcon;

import styles from "./Header.module.css";

const Header = (props) => {
  return (
    <div className={styles.Header}>
      <div className={styles.Options}>{props.children}</div>
      <div className={styles.Title}>{props.text}</div>
    </div>
  );
};

export default Header;

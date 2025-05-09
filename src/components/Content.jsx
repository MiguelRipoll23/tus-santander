import styles from "./Content.module.css";

const View = (props) => {
  const paddingBottom = props.paddingBottom ?? "0";

  return (
    <main className={styles.ContentStyled} style={{ paddingBottom }}>
      {props.children}
    </main>
  );
};

export default View;

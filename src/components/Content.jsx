import styles from "./Content.module.css";

const View = (props) => {
  return (
    <main className={styles.ContentStyled} style={{ paddingBottom: props.paddingBottom }}>
      {props.children}
    </main>
  );
};

export default View;

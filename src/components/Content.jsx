import styles from "./Content.module.css";

const View = (props) => {
  const paddingBottom = props.paddingBottom ?? "0";

  return (
    <main className={styles.Content} style={{ paddingBottom }}>
      {props.children}
    </main>
  );
};

export default View;

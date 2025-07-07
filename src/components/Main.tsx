import styles from "./Main.module.css";

const Main = (props) => {
  const paddingBottom = props.paddingBottom ?? "0";

  return (
    <main className={styles.Content} style={{ paddingBottom }}>
      {props.children}
    </main>
  );
};

export default Main;

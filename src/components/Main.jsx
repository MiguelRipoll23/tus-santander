import styles from "./Main.module.css";

const Main = (props) => {
  const paddingTop = props.paddingTop ?? "0";
  const paddingBottom = props.paddingBottom ?? "0";

  return (
    <main className={styles.Content} style={{ paddingTop, paddingBottom }}>
      {props.children}
    </main>
  );
};

export default Main;

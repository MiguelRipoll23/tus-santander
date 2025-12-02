import styles from "./Button.module.css";

const Button = (props) => {
  return (
    <button
      type="button"
      className={`${props.className} ${styles.button}`}
      style={{ backgroundColor: props.color }}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};

export default Button;

import styles from "./Button.module.css";

const Button = (props) => {
  const buttonClass = props.color === "var(--color-light-blue)" ? styles.button : styles["button-dark"];

  return (
    <button
      className={`${buttonClass} ${props.className}`}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};

export default Button;

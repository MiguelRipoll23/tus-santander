import Styles from "./Button.module.css";

const Button = (props) => {
  return (
    <button
      className={`${props.className} ${Styles.button}`}
      style={{ backgroundColor: props.color }}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};

export default Button;

import styles from "./Error.module.css";

import Button from "./Button.jsx";

const Error = (props) => {
  return (
    <div className={styles.ErrorStyled}>
      <div className={styles.TextStyled}>{props.errorText}</div>
      <Button color="var(--color-light-blue)" onClick={props.retryAction}>
        {props.retryText}
      </Button>
    </div>
  );
};

export default Error;

import Styles from "./Error.module.css";

import Button from "./Button.jsx";

const Error = (props) => {
  return (
    <div className={Styles.Error}>
      <div className={Styles.Text}>{props.errorText}</div>
      <Button color="var(--color-light-blue)" onClick={props.retryAction}>
        {props.retryText}
      </Button>
    </div>
  );
};

export default Error;

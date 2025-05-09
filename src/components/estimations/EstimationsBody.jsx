import Styles from "./EstimationsBody.module.css";

const LineHeader = (props) => {
  const getTimeText = (minutes) => {
    let text = `- -`;

    if (minutes === 0) {
      text = ">>";
    } else if (minutes > 0) {
      text = `${minutes} MIN`;
    }

    return text;
  };

  return (
    <div className={Styles.Time}>
      <div className={Styles.Time1} id="time1" data-time={props.time1}>
        {getTimeText(props.time1)}
      </div>
      <div className={Styles.Time2}>{getTimeText(props.time2)}</div>
    </div>
  );
};

export default LineHeader;

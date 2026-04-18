import React from "react";
import styles from "./EstimationsHeader.module.css";

interface EstimationsHeaderProps {
  label: string;
  destination: string;
}

function EstimationsHeader({ label, destination }: EstimationsHeaderProps): React.JSX.Element {
  return (
    <div className={styles.LineHeader}>
      <span className={styles.LineLabel}>{label}</span>
      <span className={styles.LineDestination}>
        {destination.toUpperCase()}
      </span>
    </div>
  );
}

export default EstimationsHeader;

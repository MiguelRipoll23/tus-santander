import React from "react";
import styles from "./HomeDesktop.module.css";
import { useI18n } from "../../contexts/I18nContext";

function HomeDesktop(): React.JSX.Element {
  const { getText } = useI18n();
  return (
    <div className={styles.HomeDesktop}>
      <div className={styles.DesktopArea}>
        <img
          className={styles.DesktopQR}
          alt={getText("qr_code")}
          src="/images/qr-code-min.png"
          width="250"
          height="250"
        />
        <h1>TUS Santander</h1>
        <span
          dangerouslySetInnerHTML={{ __html: getText("desktop_instructions") }}
        />
      </div>
    </div>
  );
}

export default HomeDesktop;

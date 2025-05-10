import styles from "./HomeDesktop.module.css";

const HomeDesktop = (props) => {
  return (
    <div className={styles.HomeDesktop}>
      <div className={styles.DesktopArea}>
        <img
          className={styles.DesktopQR}
          alt="Código QR"
          src="/images/qr-code-min.png"
          width="250"
          height="250"
        />
        <h1>TUS Santander</h1>
        <span>
          Escanea el código QR que se muestra en la pantalla usando la app{" "}
          <b>Cámara</b> de tu móvil para acceder a la aplicación
        </span>
      </div>
    </div>
  );
};

export default HomeDesktop;

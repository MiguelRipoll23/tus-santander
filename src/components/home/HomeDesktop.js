import styled from "styled-components";

const HomeDesktopStyled = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  z-index: 10;

  @media (prefers-color-scheme: dark) {
    color: #fff;
    background: #000;
  }
`;

const DesktopAreaStyled = styled.div`
  margin: auto;
  text-align: center;
  width: 500px;
`;

const DesktopQrStyled = styled.img`
  border-radius: 40px;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.3);
  width: 250px;
  height: 250px;
`;

const HomeDesktop = (props) => {
  return (
    <HomeDesktopStyled>
      <DesktopAreaStyled>
        <DesktopQrStyled
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
      </DesktopAreaStyled>
    </HomeDesktopStyled>
  );
};

export default HomeDesktop;

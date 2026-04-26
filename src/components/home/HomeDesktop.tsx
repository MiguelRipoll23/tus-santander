import React from "react";
import { useI18n } from "../../contexts/I18nContext";

function HomeDesktop(): React.JSX.Element {
  const { getText } = useI18n();
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-100 dark:bg-black dark:text-white flex items-center z-10">
      <div className="m-auto text-center w-96">
        <img
          className="rounded-40 shadow-lg w-64 h-64"
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

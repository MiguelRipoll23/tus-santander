import React from "react";
import { useI18n } from "../../contexts/I18nContext";

function HomeDesktop(): React.JSX.Element {
  const { getText } = useI18n();
  return (
    <div className="fixed inset-0 bg-[#f5f5f5] flex items-center z-10 dark:bg-black dark:text-white">
      <div className="mx-auto text-center w-[500px]">
        <img
          className="rounded-[40px] shadow-[0_0_40px_rgba(0,0,0,0.3)] w-[250px] h-[250px]"
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

import React from "react";
import type { ReactNode } from "react";
import { Fragment } from "react";
import { ChevronLeft } from "lucide-react";
import Header from "./Header";

interface NavProps {
  isHeader: boolean;
  titleText: string;
  children?: ReactNode;
  onBack?: () => void;
}

function Nav({ isHeader, titleText, children, onBack }: NavProps): React.JSX.Element {
  const goBack = (): void => {
    if (onBack) { onBack(); return; }
    globalThis.history.back();
  };

  return (
    <Fragment>
      {isHeader && <Header text={titleText}>{children}</Header>}
      {isHeader === false && (
        <div className="fixed w-full flex min-h-[55px] items-center z-[1]">
          <div className="float-left w-1/3 flex flex-1">
            <button
              type="button"
              className="liquid-glass text-[15px] text-black dark:text-white p-2 mx-3.5 my-[11px] animate-fade-in shadow-none flex items-center justify-center"
              aria-label="Back"
              onClick={goBack}
            >
              <ChevronLeft size={28} aria-hidden="true" />
            </button>
          </div>
          <div className="float-left w-1/3 text-center flex flex-1">
            <span className="liquid-glass text-[15px] font-bold m-auto py-1 px-3 shadow-none">
              {titleText}
            </span>
          </div>
          <div className="float-left w-1/3 justify-end flex flex-1">{children}</div>
        </div>
      )}
    </Fragment>
  );
}

export default Nav;

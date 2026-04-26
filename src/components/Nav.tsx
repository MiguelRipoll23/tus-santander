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
        <div className="fixed w-full flex min-h-14 items-center z-1">
          <div className="flex flex-1">
            <button
              type="button"
              className="liquid-glass text-base text-black dark:text-white p-2 m-2.75 animate-fade-in flex items-center justify-center"
              aria-label="Back"
              onClick={goBack}
            >
              <ChevronLeft size={28} aria-hidden="true" />
            </button>
          </div>
          <div className="flex flex-1 text-center items-center justify-center">
            <span className="liquid-glass text-base font-bold m-auto py-1 px-3">
              {titleText}
            </span>
          </div>
          <div className="flex flex-1 justify-end">{children}</div>
        </div>
      )}
    </Fragment>
  );
}

export default Nav;

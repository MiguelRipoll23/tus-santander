import { createContext, use } from "react";
import type { ViewContextValue } from "../interfaces/view";
import { getInitialState } from "../reducers/ViewReducer";
import { INITIAL_SUB_VIEW_ID, INITIAL_VIEW_ID } from "../constants/ViewConstants";

const defaultContextValue: ViewContextValue = {
  ...getInitialState(),
  viewId: INITIAL_VIEW_ID,
  subViewId: INITIAL_SUB_VIEW_ID,
  setViewId: () => {},
  setViewIdWithData: () => {},
  setSubViewId: () => {},
  restorePopState: () => {},
};

export const ViewContext = createContext<ViewContextValue>(defaultContextValue);

export function useView(): ViewContextValue {
  const context = use(ViewContext);

  if (context === undefined) {
    throw new Error("useView must be used within ViewContext");
  }

  return context;
}

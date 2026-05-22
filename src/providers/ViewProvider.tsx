import React from "react";
import type { ReactNode, Dispatch } from "react";
import { useReducer } from "react";
import type { ViewAction, ViewContextValue, ViewData } from "../interfaces/view";
import type { ViewId, SubViewId } from "../types/view";
import { getInitialState, viewReducer } from "../reducers/ViewReducer";
import { ViewContext } from "../contexts/ViewContext";
import {
  RESTORE_POPSTATE,
  SET_SUB_VIEW_ID,
  SET_VIEW_ID,
  SET_VIEW_ID_WITH_DATA,
} from "../constants/ViewConstants";

async function dispatchWithViewTransition(
  dispatch: Dispatch<ViewAction>,
  data: ViewAction,
  isBackNavigation: boolean
): Promise<void> {
  if (!document.startViewTransition) {
    dispatch(data);
    return;
  }

  if (isBackNavigation) {
    document.documentElement.classList.add("back-transition");
  }

  const transition = document.startViewTransition(() => dispatch(data));

  try {
    await transition.finished;
  } finally {
    document.documentElement.classList.remove("back-transition");
  }
}

interface ViewProviderProps {
  children: ReactNode;
}

export function ViewProvider({ children }: ViewProviderProps): React.JSX.Element {
  const initialState = getInitialState();
  const [state, dispatch] = useReducer(viewReducer, initialState);

  const setViewId = (
    viewId: ViewId,
    pushState = true,
    isBackNavigation = false
  ): void => {
    const dispatchData: ViewAction = {
      type: SET_VIEW_ID,
      payload: viewId,
      pushState,
    };

    void dispatchWithViewTransition(dispatch, dispatchData, isBackNavigation);
  };

  const setViewIdWithData = (
    viewId: ViewId,
    data: ViewData | null,
    pushState = true,
    isBackNavigation = false
  ): void => {
    const dispatchData: ViewAction = {
      type: SET_VIEW_ID_WITH_DATA,
      payload: { viewId, data },
      pushState,
    };

    void dispatchWithViewTransition(dispatch, dispatchData, isBackNavigation);
  };

  const setSubViewId = (subViewId: SubViewId, pushState = true): void => {
    dispatch({
      type: SET_SUB_VIEW_ID,
      payload: subViewId,
      pushState,
    });
  };

  const restorePopState = (
    viewId: ViewId,
    subViewId: SubViewId,
    data: ViewData | null,
    pushState = false,
    isBackNavigation = false
  ): void => {
    const dispatchData: ViewAction = {
      type: RESTORE_POPSTATE,
      payload: { viewId, subViewId, data },
      pushState,
    };

    void dispatchWithViewTransition(dispatch, dispatchData, isBackNavigation);
  };

  const value: ViewContextValue = {
    index: state.index,
    viewId: state.viewId,
    subViewId: state.subViewId,
    data: state.data,
    setViewId,
    setViewIdWithData,
    setSubViewId,
    restorePopState,
  };

  return <ViewContext.Provider value={value}>{children}</ViewContext.Provider>;
}

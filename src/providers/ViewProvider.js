import { useReducer } from "react";
import { viewReducer, getInitialState } from "../reducers/ViewReducer.js";
import { ViewContext } from "../contexts/ViewContext.js";

import {
  SET_VIEW_ID,
  SET_VIEW_ID_WITH_DATA,
  SET_SUB_VIEW_ID,
} from "../constants/ViewConstants.js";

async function dispatchWithViewTransition(dispatch, data, isBackNavigation) {
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

export const ViewProvider = ({ children }) => {
  const initialState = getInitialState();
  const [state, dispatch] = useReducer(viewReducer, initialState);

  const setViewId = (viewId, pushState = true, isBackNavigation = false) => {
    const dispatchData = {
      type: SET_VIEW_ID,
      payload: viewId,
      pushState,
    };

    dispatchWithViewTransition(dispatch, dispatchData, isBackNavigation);
  };

  const setViewIdWithData = (
    viewId,
    data,
    pushState = true,
    isBackNavigation = false
  ) => {
    const dispatchData = {
      type: SET_VIEW_ID_WITH_DATA,
      payload: {
        viewId,
        data,
      },
      pushState,
    };

    dispatchWithViewTransition(dispatch, dispatchData, isBackNavigation);
  };

  const setSubViewId = (subViewId, pushState = true) => {
    dispatch({
      type: SET_SUB_VIEW_ID,
      payload: subViewId,
      pushState,
    });
  };

  const value = {
    index: state.index,
    viewId: state.viewId,
    subViewId: state.subViewId,
    data: state.data,
    setViewId,
    setViewIdWithData,
    setSubViewId,
  };

  return <ViewContext.Provider value={value}>{children}</ViewContext.Provider>;
};

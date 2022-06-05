import { useReducer } from "react";
import { viewReducer, initialState } from "../reducers/ViewReducer.js";
import { ViewContext } from "../contexts/ViewContext.js";

import * as ViewConstants from "../constants/ViewConstants.js";

export const ViewProvider = ({ children }) => {
  const [state, dispatch] = useReducer(viewReducer, initialState);

  const setViewId = (viewId, pushState = true) => {
    dispatch({
      type: ViewConstants.SET_VIEW_ID,
      payload: viewId,
      pushState,
    });
  };

  const setViewIdWithData = (viewId, data, pushState = true) => {
    dispatch({
      type: ViewConstants.SET_VIEW_ID_WITH_DATA,
      payload: {
        viewId,
        data,
      },
      pushState,
    });
  };

  const setSubViewId = (subViewId, pushState = true) => {
    dispatch({
      type: ViewConstants.SET_SUB_VIEW_ID,
      payload: subViewId,
      pushState,
    });
  };

  const value = {
    viewId: state.viewId,
    subViewId: state.subViewId,
    data: state.data,
    setViewId,
    setViewIdWithData,
    setSubViewId,
  };

  return <ViewContext.Provider value={value}>{children}</ViewContext.Provider>;
};

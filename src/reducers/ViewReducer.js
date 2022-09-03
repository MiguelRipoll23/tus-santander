import * as ViewConstants from "../constants/ViewConstants.js";

const sessionStorageStateKey = "state";

export const getInitialState = () => {
  const state = sessionStorage.getItem(sessionStorageStateKey);

  if (state === null) {
    return {
      viewId: ViewConstants.INITIAL_VIEW_ID,
      subViewId: ViewConstants.INITIAL_SUB_VIEW_ID,
      data: null,
    };
  }

  return JSON.parse(state);
};

export const viewReducer = (state, action) => {
  const { type, payload, pushState } = action;

  let updatedState = null;

  switch (type) {
    case ViewConstants.SET_VIEW_ID:
      updatedState = {
        ...state,
        viewId: payload,
      };

      break;

    case ViewConstants.SET_VIEW_ID_WITH_DATA:
      const { viewId, data } = payload;

      updatedState = {
        ...state,
        viewId: viewId,
        data: data,
      };

      break;

    case ViewConstants.SET_SUB_VIEW_ID:
      updatedState = {
        ...state,
        subViewId: payload,
      };

      break;

    default:
      throw new Error(`No case for type ${type} found in viewReducer`);
  }

  // Update session storage
  const updatedStateAsString = JSON.stringify(updatedState);
  sessionStorage.setItem(sessionStorageStateKey, updatedStateAsString);

  // Update history
  if (pushState) {
    window.history.pushState(updatedState, "");
    console.log("pushState", updatedState);
  }

  return updatedState;
};

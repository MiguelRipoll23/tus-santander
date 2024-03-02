import {
  SET_VIEW_ID,
  SET_VIEW_ID_WITH_DATA,
  SET_SUB_VIEW_ID,
  INITIAL_VIEW_ID,
  INITIAL_SUB_VIEW_ID,
} from "../constants/ViewConstants.js";

const sessionStorageStateKey = "state";

export const getInitialState = () => {
  const state = sessionStorage.getItem(sessionStorageStateKey);

  if (state === null) {
    return {
      index: 0,
      viewId: INITIAL_VIEW_ID,
      subViewId: INITIAL_SUB_VIEW_ID,
      data: null,
    };
  }

  return JSON.parse(state);
};

export const viewReducer = (state, action) => {
  const { type, payload, pushState } = action;

  let updatedState = null;

  switch (type) {
    case SET_VIEW_ID:
      updatedState = {
        ...state,
        viewId: payload,
      };

      break;

    case SET_VIEW_ID_WITH_DATA:
      const { viewId, data } = payload;

      updatedState = {
        ...state,
        viewId: viewId,
        data: data,
      };

      break;

    case SET_SUB_VIEW_ID:
      updatedState = {
        ...state,
        subViewId: payload,
      };

      break;

    default:
      throw new Error(`No case for type ${type} found in viewReducer`);
  }

  // eslint-disable-next-line no-restricted-globals
  updatedState.index = history.state ? history.state.index + 1 : 1;

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

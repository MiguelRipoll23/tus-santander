import * as ViewConstants from "../constants/ViewConstants.js";

export const initialState = {
  viewId: ViewConstants.INITIAL_VIEW_ID,
  subViewId: ViewConstants.INITIAL_SUB_VIEW_ID,
  data: null,
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

  if (pushState) {
    window.history.pushState(updatedState, "");
    console.log("pushState", updatedState);
  }

  return updatedState;
};

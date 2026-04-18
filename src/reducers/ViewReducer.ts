import type { ViewState, ViewAction } from "../interfaces/view";
import {
  INITIAL_SUB_VIEW_ID,
  INITIAL_VIEW_ID,
  SET_SUB_VIEW_ID,
  SET_VIEW_ID,
  SET_VIEW_ID_WITH_DATA,
} from "../constants/ViewConstants";

const SESSION_STORAGE_STATE_KEY = "state";

export function getInitialState(): ViewState {
  const state = sessionStorage.getItem(SESSION_STORAGE_STATE_KEY);

  if (state === null) {
    return {
      index: 0,
      viewId: INITIAL_VIEW_ID,
      subViewId: INITIAL_SUB_VIEW_ID,
      data: null,
    };
  }

  return JSON.parse(state) as ViewState;
}

export function viewReducer(state: ViewState, action: ViewAction): ViewState {
  const { type, payload, pushState } = action;

  let updatedState: ViewState | null = null;

  switch (type) {
    case SET_VIEW_ID:
      updatedState = {
        ...state,
        viewId: payload,
      };
      break;

    case SET_VIEW_ID_WITH_DATA: {
      const { viewId, data } = payload;
      updatedState = {
        ...state,
        viewId,
        data,
      };
      break;
    }

    case SET_SUB_VIEW_ID:
      updatedState = {
        ...state,
        subViewId: payload,
      };
      break;

    default:
      throw new Error(`No case for type ${type} found in viewReducer`);
  }

  // history.state is any from the DOM lib; we always push ViewState objects
  const currentHistoryState = history.state as ViewState | null;
  updatedState.index = currentHistoryState ? currentHistoryState.index + 1 : 1;

  sessionStorage.setItem(
    SESSION_STORAGE_STATE_KEY,
    JSON.stringify(updatedState)
  );

  if (pushState) {
    globalThis.history.pushState(updatedState, "");
    console.log("pushState", updatedState);
  }

  return updatedState;
}

import type { ViewId, SubViewId } from "../types/view";

export interface StopViewData {
  stopId: number;
  stopName: string;
}

export interface LineViewData {
  stopId: number;
  stopName: string;
  lineLabel: string;
  lineDestination: string;
}

export interface RouteViewData {
  stopId: number;
  lineLabel: string;
  lineDestination: string;
}

export type ViewData = StopViewData | LineViewData | RouteViewData;

export interface ViewState {
  index: number;
  viewId: ViewId;
  subViewId: SubViewId;
  data: ViewData | null;
}

export type SetViewIdAction = {
  type: "SET_VIEW_ID";
  payload: ViewId;
  pushState: boolean;
};

export type SetViewIdWithDataAction = {
  type: "SET_VIEW_ID_WITH_DATA";
  payload: { viewId: ViewId; data: ViewData | null };
  pushState: boolean;
};

export type SetSubViewIdAction = {
  type: "SET_SUB_VIEW_ID";
  payload: SubViewId;
  pushState: boolean;
};

export type ViewAction =
  | SetViewIdAction
  | SetViewIdWithDataAction
  | SetSubViewIdAction;

export interface ViewContextValue extends ViewState {
  setViewId: (
    viewId: ViewId,
    pushState?: boolean,
    isBackNavigation?: boolean
  ) => void;
  setViewIdWithData: (
    viewId: ViewId,
    data: ViewData | null,
    pushState?: boolean,
    isBackNavigation?: boolean
  ) => void;
  setSubViewId: (subViewId: SubViewId, pushState?: boolean) => void;
}

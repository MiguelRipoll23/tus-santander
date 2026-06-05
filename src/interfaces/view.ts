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
  restorePopState: (
    viewId: ViewId,
    subViewId: SubViewId,
    data: ViewData | null,
    pushState?: boolean,
    isBackNavigation?: boolean
  ) => void;
}

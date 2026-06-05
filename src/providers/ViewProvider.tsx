import React from "react";
import type { ReactNode } from "react";
import { useCallback, useMemo } from "react";
import type { NavigateFunction } from "react-router";
import { useLocation, useNavigate } from "react-router";
import type { ViewContextValue, ViewData } from "../interfaces/view";
import type { SubViewId, ViewId } from "../types/view";
import { ViewContext } from "../contexts/ViewContext";
import {
  INITIAL_SUB_VIEW_ID,
  INITIAL_VIEW_ID,
  SUB_VIEW_ID_MAP,
  SUB_VIEW_ID_SEARCH,
  VIEW_ID_ESTIMATIONS_LINE,
  VIEW_ID_ESTIMATIONS_STOP,
  VIEW_ID_HOME,
  VIEW_ID_MAP,
  VIEW_ID_ROUTE_LINE,
} from "../constants/ViewConstants";
import allMarkers from "../utils/MarkerUtils";

interface ViewProviderProps {
  children: ReactNode;
}

interface ViewLocationState {
  data?: ViewData | null;
}

interface RouteMatch {
  viewId: ViewId;
  subViewId: SubViewId;
  data: ViewData | null;
}

function isViewLocationState(value: unknown): value is ViewLocationState {
  return typeof value === "object" && value !== null && "data" in value;
}

function getLocationStateData(state: unknown): ViewData | null {
  if (!isViewLocationState(state)) {
    return null;
  }

  return state.data ?? null;
}

function getStopName(stopId: number, data: ViewData | null): string {
  if (data !== null && "stopName" in data) {
    return data.stopName;
  }

  return allMarkers.find((marker) => marker.id === stopId)?.text ?? "";
}

function buildLineSearchParams(data: ViewData): string {
  if (!("lineDestination" in data)) {
    return "";
  }

  const params = new URLSearchParams({
    destination: data.lineDestination,
  });

  if ("stopName" in data) {
    params.set("stopName", data.stopName);
  }

  return `?${params.toString()}`;
}

const hasStopId = (
  data: ViewData | null,
): data is ViewData & { stopId: number } => data !== null && "stopId" in data;

const hasLineLabel = (
  data: ViewData | null,
): data is ViewData & { stopId: number; lineLabel: string } =>
  data !== null && "lineLabel" in data;

const buildLinePath = (
  data: ViewData & { stopId: number; lineLabel: string },
  suffix = "",
): string => {
  const lineLabel = encodeURIComponent(data.lineLabel);
  return `/stops/${data.stopId}/lines/${lineLabel}${suffix}${buildLineSearchParams(data)}`;
};

function getPathForView(viewId: ViewId, data: ViewData | null): string {
  switch (viewId) {
    case VIEW_ID_HOME:
      return "/";

    case VIEW_ID_MAP:
      return "/map";

    case VIEW_ID_ESTIMATIONS_STOP:
      return hasStopId(data) ? `/stops/${data.stopId}` : "/";

    case VIEW_ID_ESTIMATIONS_LINE:
      return hasLineLabel(data) ? buildLinePath(data) : "/";

    case VIEW_ID_ROUTE_LINE:
      return hasLineLabel(data) ? buildLinePath(data, "/route") : "/";

    default:
      return "/";
  }
}

function safeDecodeURIComponent(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function getIndexFromHistoryState(): number {
  const currentState = history.state as unknown;

  if (
    typeof currentState === "object" &&
    currentState !== null &&
    "idx" in currentState &&
    typeof currentState.idx === "number"
  ) {
    return currentState.idx;
  }

  return 0;
}

function getRouteMatch(
  pathname: string,
  search: string,
  state: unknown,
): RouteMatch {
  const searchParams = new URLSearchParams(search);
  const data = getLocationStateData(state);

  if (pathname === "/map") {
    return { viewId: VIEW_ID_MAP, subViewId: SUB_VIEW_ID_MAP, data: null };
  }

  if (pathname === "/search") {
    return { viewId: VIEW_ID_HOME, subViewId: SUB_VIEW_ID_SEARCH, data: null };
  }

  const routeLineMatch = pathname.match(
    /^\/stops\/(\d+)\/lines\/([^/]+)\/route$/,
  );
  if (routeLineMatch) {
    const stopId = Number(routeLineMatch[1]);
    const lineLabel = safeDecodeURIComponent(routeLineMatch[2]);
    const lineDestination = searchParams.get("destination") ?? "";

    return {
      viewId: VIEW_ID_ROUTE_LINE,
      subViewId: INITIAL_SUB_VIEW_ID,
      data: {
        stopId,
        lineLabel,
        lineDestination,
      },
    };
  }

  const lineMatch = pathname.match(/^\/stops\/(\d+)\/lines\/([^/]+)$/);
  if (lineMatch) {
    const stopId = Number(lineMatch[1]);
    const lineLabel = safeDecodeURIComponent(lineMatch[2]);
    const lineDestination = searchParams.get("destination") ?? "";
    const stopName = searchParams.get("stopName") ?? getStopName(stopId, data);

    return {
      viewId: VIEW_ID_ESTIMATIONS_LINE,
      subViewId: INITIAL_SUB_VIEW_ID,
      data: {
        stopId,
        stopName,
        lineLabel,
        lineDestination,
      },
    };
  }

  const stopMatch = pathname.match(/^\/stops\/(\d+)$/);
  if (stopMatch) {
    const stopId = Number(stopMatch[1]);

    return {
      viewId: VIEW_ID_ESTIMATIONS_STOP,
      subViewId: INITIAL_SUB_VIEW_ID,
      data: {
        stopId,
        stopName: getStopName(stopId, data),
      },
    };
  }

  return {
    viewId: INITIAL_VIEW_ID,
    subViewId: INITIAL_SUB_VIEW_ID,
    data: null,
  };
}

async function navigateWithViewTransition(
  navigate: NavigateFunction,
  path: string,
  data: ViewData | null,
  replace: boolean,
  isBackNavigation: boolean,
): Promise<void> {
  const navigateToPath = (): void => {
    void navigate(path, { replace, state: { data } });
  };

  if (!document.startViewTransition) {
    navigateToPath();
    return;
  }

  if (isBackNavigation) {
    document.documentElement.classList.add("back-transition");
  }

  const transition = document.startViewTransition(navigateToPath);

  try {
    await transition.finished;
  } finally {
    document.documentElement.classList.remove("back-transition");
  }
}

export function ViewProvider({ children }: ViewProviderProps): React.JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const routeMatch = useMemo(
    () => getRouteMatch(location.pathname, location.search, location.state),
    [location.pathname, location.search, location.state],
  );

  const setViewId = useCallback(
    (viewId: ViewId, pushState = true, isBackNavigation = false): void => {
      const path = getPathForView(viewId, null);
      void navigateWithViewTransition(
        navigate,
        path,
        null,
        !pushState,
        isBackNavigation,
      );
    },
    [navigate],
  );

  const setViewIdWithData = useCallback(
    (
      viewId: ViewId,
      data: ViewData | null,
      pushState = true,
      isBackNavigation = false,
    ): void => {
      const path = getPathForView(viewId, data);
      void navigateWithViewTransition(
        navigate,
        path,
        data,
        !pushState,
        isBackNavigation,
      );
    },
    [navigate],
  );

  const setSubViewId = useCallback(
    (subViewId: SubViewId, pushState = true): void => {
      const path = subViewId === SUB_VIEW_ID_SEARCH ? "/search" : "/";
      void navigate(path, { replace: !pushState, state: { data: null } });
    },
    [navigate],
  );

  const restorePopState = useCallback(
    (
      viewId: ViewId,
      _subViewId: SubViewId,
      data: ViewData | null,
      pushState = false,
      isBackNavigation = false,
    ): void => {
      const path = getPathForView(viewId, data);
      void navigateWithViewTransition(
        navigate,
        path,
        data,
        !pushState,
        isBackNavigation,
      );
    },
    [navigate],
  );

  const value: ViewContextValue = {
    index: getIndexFromHistoryState(),
    viewId: routeMatch.viewId,
    subViewId: routeMatch.subViewId,
    data: routeMatch.data,
    setViewId,
    setViewIdWithData,
    setSubViewId,
    restorePopState,
  };

  return <ViewContext.Provider value={value}>{children}</ViewContext.Provider>;
}

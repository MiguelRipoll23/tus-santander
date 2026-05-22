import React, { useEffect } from "react";
import { useView } from "../contexts/ViewContext";
import type { ViewId } from "../types/view";
import {
  INITIAL_SUB_VIEW_ID,
  INITIAL_VIEW_ID,
  VIEW_ID_ESTIMATIONS_LINE,
  VIEW_ID_ESTIMATIONS_STOP,
  VIEW_ID_HOME,
  VIEW_ID_MAP,
  VIEW_ID_ROUTE_LINE,
} from "../constants/ViewConstants";
import type { ViewState } from "../interfaces/view";

import HomeView from "../views/home/HomeView";
import MapView from "../views/map/MapView";
import EstimationsStopView from "../views/estimations-stop/EstimationsStopView";
import EstimationsLineView from "../views/estimations-line/EstimationsLineView";
import RouteLineView from "../views/route-line/RouteLineView";

interface SelectedViewProps {
  viewId: ViewId;
}

function SelectedView({ viewId }: SelectedViewProps): React.JSX.Element | null {
  switch (viewId) {
    case VIEW_ID_HOME:
      return <HomeView />;

    case VIEW_ID_MAP:
      return <MapView />;

    case VIEW_ID_ESTIMATIONS_STOP:
      return <EstimationsStopView />;

    case VIEW_ID_ESTIMATIONS_LINE:
      return <EstimationsLineView />;

    case VIEW_ID_ROUTE_LINE:
      return <RouteLineView />;

    default:
      return null;
  }
}

function View(): React.JSX.Element {
  const { index, viewId, restorePopState } =
    useView();

  useEffect(() => {
    const handlePopState = (event: PopStateEvent): void => {
      // event.state is `any` in the DOM lib; we always pushState ViewState objects
      const rawState: unknown = event.state;

      if (rawState === null || rawState === undefined) {
        restorePopState(INITIAL_VIEW_ID, INITIAL_SUB_VIEW_ID, null, false, true);
        return;
      }

      const state = rawState as ViewState;
      const isBackNavigation = state.index < index;

      restorePopState(state.viewId, state.subViewId, state.data, false, isBackNavigation);
    };

    globalThis.onpopstate = handlePopState;

    return () => {
      globalThis.onpopstate = null;
    };
  }, [index, restorePopState]);

  return <SelectedView viewId={viewId} />;
}

export default View;

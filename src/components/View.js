import { useView } from "../contexts/ViewContext.js";
import {
  VIEW_ID_HOME,
  VIEW_ID_MAP,
  VIEW_ID_ESTIMATIONS_STOP,
  VIEW_ID_ESTIMATIONS_LINE,
  VIEW_ID_ROUTE_LINE,
  INITIAL_VIEW_ID,
  INITIAL_SUB_VIEW_ID,
} from "../constants/ViewConstants.js";

import HomeView from "../views/home/HomeView.js";
import MapView from "../views/map/MapView.js";
import EstimationsStopView from "../views/estimations-stop/EstimationsStopView.js";
import EstimationsLineView from "../views/estimations-line/EstimationsLineView.js";
import RouteLineView from "../views/route-line/RouteLineView.js";

const SelectedView = (props) => {
  const { viewId } = props;

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
};

const View = (props) => {
  const { index, viewId, setViewId, setSubViewId, setViewIdWithData } =
    useView();

  window.onpopstate = (event) => {
    const state = event.state;
    console.log("onpopstate", state);

    if (state === null) {
      setViewId(INITIAL_VIEW_ID, false, true);
      setSubViewId(INITIAL_SUB_VIEW_ID, false);
      return;
    }

    const isBackNavigation = state.index < index;

    setViewIdWithData(state.viewId, state.data, false, isBackNavigation);
    setSubViewId(state.subViewId, false);
  };

  return <SelectedView viewId={viewId} />;
};

export default View;

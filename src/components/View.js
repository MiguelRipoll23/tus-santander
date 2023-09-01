import { useView } from "../contexts/ViewContext.js";
import * as ViewConstants from "../constants/ViewConstants.js";

import HomeView from "../views/home/HomeView.js";
import MapView from "../views/map/MapView.js";
import EstimationsStopView from "../views/estimations-stop/EstimationsStopView.js";
import EstimationsLineView from "../views/estimations-line/EstimationsLineView.js";
import RouteLineView from "../views/route-line/RouteLineView.js";

let currentStateId = 0;

const SelectedView = (props) => {
  const { viewId } = props;

  switch (viewId) {
    case ViewConstants.VIEW_ID_HOME:
      return <HomeView />;

    case ViewConstants.VIEW_ID_MAP:
      return <MapView />;

    case ViewConstants.VIEW_ID_ESTIMATIONS_STOP:
      return <EstimationsStopView />;

    case ViewConstants.VIEW_ID_ESTIMATIONS_LINE:
      return <EstimationsLineView />;

    case ViewConstants.VIEW_ID_ROUTE_LINE:
      return <RouteLineView />;

    default:
      return null;
  }
};

const View = (props) => {
  const { viewId, setViewId, setSubViewId, setViewIdWithData } = useView();

  window.onpopstate = (event) => {
    const state = event.state;
    console.log("onpopstate", state);

    if (state === null) {
      setViewId(ViewConstants.INITIAL_VIEW_ID, false, true);
      setSubViewId(ViewConstants.INITIAL_SUB_VIEW_ID, false);
      return;
    }

    const isBackNavigation = state.id < currentStateId;
    currentStateId = state.id;

    setViewIdWithData(state.viewId, state.data, false, isBackNavigation);
    setSubViewId(state.subViewId, false);
  };

  return <SelectedView viewId={viewId} />;
};

export default View;

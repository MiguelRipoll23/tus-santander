import { useView } from "../contexts/ViewContext.jsx";
import {
  INITIAL_SUB_VIEW_ID,
  INITIAL_VIEW_ID,
  VIEW_ID_ESTIMATIONS_LINE,
  VIEW_ID_ESTIMATIONS_STOP,
  VIEW_ID_HOME,
  VIEW_ID_MAP,
  VIEW_ID_ROUTE_LINE,
} from "../constants/ViewConstants.jsx";

import HomeView from "../views/home/HomeView.jsx";
import MapView from "../views/map/MapView.jsx";
import EstimationsStopView from "../views/estimations-stop/EstimationsStopView.jsx";
import EstimationsLineView from "../views/estimations-line/EstimationsLineView.jsx";
import RouteLineView from "../views/route-line/RouteLineView.jsx";

import styles from "./View.module.css";

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

  return <SelectedView viewId={viewId} className={styles.SelectedView} />;
};

export default View;

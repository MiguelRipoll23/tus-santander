import React from "react";
import { Navigate, Route, Routes } from "react-router";

import HomeView from "../views/home/HomeView";
import MapView from "../views/map/MapView";
import EstimationsStopView from "../views/estimations-stop/EstimationsStopView";
import EstimationsLineView from "../views/estimations-line/EstimationsLineView";
import RouteLineView from "../views/route-line/RouteLineView";

function View(): React.JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<HomeView />} />
      <Route path="/search" element={<HomeView />} />
      <Route path="/map" element={<MapView />} />
      <Route path="/stops/:stopId" element={<EstimationsStopView />} />
      <Route
        path="/stops/:stopId/lines/:lineLabel"
        element={<EstimationsLineView />}
      />
      <Route
        path="/stops/:stopId/lines/:lineLabel/route"
        element={<RouteLineView />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default View;

import type { ReactNode } from "react";
import { AdvancedMarker } from "@vis.gl/react-google-maps";
import type { Marker } from "../../interfaces/marker";
import { useView } from "../../contexts/ViewContext";
import { VIEW_ID_ESTIMATIONS_STOP } from "../../constants/ViewConstants";

import MarkerMin from "../../assets/marker-min.png";

interface ClosestMarkersProps {
  markers: Marker[];
}

function ClosestMarkers({ markers }: ClosestMarkersProps): ReactNode {
  const { setViewIdWithData } = useView();

  const loadEstimationsStopView = (marker: Marker): void => {
    setViewIdWithData(VIEW_ID_ESTIMATIONS_STOP, {
      stopId: marker.id,
      stopName: marker.text,
    });
  };

  return markers.map((marker, i) => {
    return (
      <AdvancedMarker
        key={i}
        position={marker.position}
        onClick={() => loadEstimationsStopView(marker)}
      >
        <div className="marker">
          <img alt="Pin" src={MarkerMin}></img>
          <span>{marker.text}</span>
        </div>
      </AdvancedMarker>
    );
  });
}

export default ClosestMarkers;

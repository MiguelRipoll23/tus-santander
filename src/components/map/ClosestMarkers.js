import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { useView } from "../../contexts/ViewContext.js";
import { VIEW_ID_ESTIMATIONS_STOP } from "../../constants/ViewConstants.js";

import MarkerMin from "../../assets/marker-v2-min.png";

const ClosestMarkers = (props) => {
  const { markers } = props;
  const { setViewIdWithData } = useView();

  const loadEstimationsStopView = (marker) => {
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
};

export default ClosestMarkers;

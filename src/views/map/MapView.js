import { Fragment, memo, useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import ApiUtils from "../../utils/ApiUtils.js";

import { useView } from "../../contexts/ViewContext.js";
import * as ViewConstants from "../../constants/ViewConstants.js";

import Nav from "../../components/Nav.js";
import Content from "../../components/Content.js";
import Spinner from "../../components/Spinner.js";
import Error from "../../components/Error.js";

import Stops from "../../json/stops.min.json";
import MarkerMin from "../../assets/marker-min.png";

const libraries = ["geometry"];

let map = null;
let markers = [];

const MapView = (props) => {
  const { setViewIdWithData } = useView();
  const [closestMarkers, setClosestMarkers] = useState([]);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: ApiUtils.GOOGLE_MAPS_KEY,
    libraries,
  });

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        map.setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });

        showClosestMarkers();
      },
      (error) => {
        if (error.code === 1 || error.code === 3) {
          return;
        }

        alert("La ubicación no está disponible");
      }
    );
  };

  const getAndShowClosestMarkers = () => {
    for (let stopKey in Stops) {
      const [id, latitude, longitude, name] = Stops[stopKey];

      const marker = {
        id: id,
        text: name,
        position: {
          lat: latitude,
          lng: longitude,
        },
      };

      markers.push(marker);
    }

    showClosestMarkers();
  };

  const showClosestMarkers = useCallback(() => {
    const bounds = map.getBounds();
    const center = map.getCenter();

    const closestMarkers = markers
      .filter((marker) => bounds.contains(marker.position))
      .map((marker) => {
        const centerDistance =
          window.google.maps.geometry.spherical.computeDistanceBetween(
            marker.position,
            center
          );
        return { ...marker, centerDistance };
      })
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 10);

    setClosestMarkers(closestMarkers);
  }, []);

  const loadEstimationsStopView = (marker) => {
    setViewIdWithData(ViewConstants.VIEW_ID_ESTIMATIONS_STOP, {
      stopId: parseInt(marker.id),
      stopName: marker.text,
    });
  };

  const refresh = () => {
    window.location.refresh();
  };

  const containerStyle = {
    width: "100%",
    height: "calc(100vh - 56px)",
  };

  const mapOptions = {
    fullscreenControl: false,
    disableDefaultUI: true,
  };

  const handleOnLoad = (loadedMap) => {
    map = loadedMap;

    // Initial center
    map.setCenter({ lat: 43.462068, lng: -3.810204 });

    // Update center with user location
    getCurrentLocation();

    // Markers
    window.google.maps.event.addListenerOnce(
      map,
      "idle",
      getAndShowClosestMarkers
    );
  };

  const handleOnDrag = () => {
    showClosestMarkers();
  };

  const renderMap = () => (
    <GoogleMap
      mapContainerStyle={containerStyle}
      options={mapOptions}
      zoom={17}
      onLoad={handleOnLoad}
      onDrag={handleOnDrag}
    >
      {closestMarkers.map((marker, i) => {
        return (
          <Marker
            key={i}
            label={{
              color: "#1da1f2",
              text: marker.text,
              fontSize: "14px",
            }}
            position={marker.position}
            icon={{
              url: MarkerMin,
              labelOrigin: new window.google.maps.Point(11, 40),
            }}
            onClick={() => loadEstimationsStopView(marker)}
          />
        );
      })}
    </GoogleMap>
  );

  if (loadError) {
    return (
      <Error
        error_text="No disponible"
        retry_text="Volver a intentar"
        retry_action={refresh}
      />
    );
  }

  return (
    <Fragment>
      <Nav isHeader={false} titleText="Mapa" />
      <Content>
        {isLoaded ? renderMap() : <Spinner />}
        {loadError && (
          <Error
            error_text="No disponible"
            retry_text="Volver a intentar"
            retry_action={refresh}
          />
        )}
      </Content>
    </Fragment>
  );
};

export default memo(MapView);

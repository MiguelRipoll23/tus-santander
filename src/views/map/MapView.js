import { Fragment, memo, useState, useCallback, useEffect } from "react";
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

const MapView = (props) => {
  const { setViewIdWithData } = useView();

  const [position, setPosition] = useState({ lat: 43.462068, lng: -3.810204 });
  const [markers, setMarkers] = useState([]);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: ApiUtils.GOOGLE_MAPS_KEY,
  });

  const getCurrentPosition = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        if (error.code === 1 || error.code === 3) {
          return;
        }

        alert("La localización no está disponible");
      }
    );
  };

  const getMarkers = () => {
    const list = [];

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

      list.push(marker);
    }

    setMarkers(list);
  };

  // Stop estimations
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

  const onLoad = useCallback(
    function callback(map) {
      map.setCenter(position);
    },
    [position]
  );

  // Mount
  useEffect(() => {
    getMarkers();
    getCurrentPosition();
  }, []);

  const renderMap = () => (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={position}
      zoom={17}
      options={mapOptions}
      onLoad={onLoad}
    >
      {markers.map((marker, i) => {
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

import { Fragment, useEffect, useState, useCallback } from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { GOOGLE_MAPS_KEY } from "../../utils/ApiConstants.js";

import Nav from "../../components/Nav.js";
import Content from "../../components/Content.js";
import Spinner from "../../components/Spinner.js";
import ClosestMarkers from "../../components/map/ClosestMarkers.js";

import Stops from "../../json/stops.min.json";

const markers = [];

const MapView = (props) => {
  const apiKey = GOOGLE_MAPS_KEY;
  const libraries = ["geometry"];
  const defaultCenter = { lat: 43.462068, lng: -3.810204 };
  const defaultZoom = 17;

  const [loading, setLoading] = useState(true);
  const [center, setCenter] = useState(defaultCenter);
  const [closestMarkers, setClosestMarkers] = useState([]);

  const getCurrentLocation = () => {
    const successCallback = (position) => {
      setCenter({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    };

    const errorCallback = (error) => {
      if (error.code === 1 || error.code === 3) {
        return;
      }
      alert("La ubicación no está disponible");
    };

    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  };

  const getMarkers = () => {
    for (let key in Stops) {
      const [id, latitude, longitude, name] = Stops[key];

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
  };

  const mapOptions = {
    mapId: "map",
    defaultZoom,
    fullscreenControl: false,
    disableDefaultUI: true,
    center,
    styles: [
      {
        featureType: "transit.station.bus",
        elementType: "labels.icon",
        stylers: [{ visibility: "off" }],
      },
    ],
  };

  const handleApiLoaded = () => {
    setLoading(false);
  };

  const handleCameraChange = useCallback((event) => {
    const { zoom, center } = event.detail;
    setCenter(center);

    const bounds = new window.google.maps.LatLngBounds(
      { lat: event.detail.bounds.south, lng: event.detail.bounds.west },
      { lat: event.detail.bounds.north, lng: event.detail.bounds.east }
    );

    const metersPerPixel =
      (156543.03392 * Math.cos((center.lat * Math.PI) / 180)) /
      Math.pow(2, zoom);

    const meters = 27.5 * metersPerPixel;
    const degrees = meters / 111320;
    const newCenter = { lat: center.lat + degrees, lng: center.lng };

    const closestMarkers = markers
      .filter((marker) => bounds.contains(marker.position))
      .map((marker) => {
        const centerDistance =
          window.google.maps.geometry.spherical.computeDistanceBetween(
            marker.position,
            newCenter
          );
        return { ...marker, centerDistance };
      })
      .sort((a, b) => a.centerDistance - b.centerDistance)
      .slice(0, 10);

    setClosestMarkers(closestMarkers);
  }, []);

  const getMap = () => (
    <Map {...mapOptions} onCameraChanged={handleCameraChange}>
      <ClosestMarkers markers={closestMarkers} />
    </Map>
  );

  // Mount
  useEffect(() => {
    getCurrentLocation();
    getMarkers();
  }, []);

  return (
    <Fragment>
      <Nav isHeader={false} titleText="Mapa" />
      <Content>
        <APIProvider
          apiKey={apiKey}
          libraries={libraries}
          onLoad={handleApiLoaded}
        >
          {loading ? <Spinner /> : getMap()}
        </APIProvider>
      </Content>
    </Fragment>
  );
};

export default MapView;

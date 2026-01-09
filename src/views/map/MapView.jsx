import { Fragment, useCallback, useEffect, useState } from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { GOOGLE_MAPS_KEY } from "../../utils/ApiConstants.jsx";
import { trackMapView } from "../../utils/TelemetryUtils.jsx";
import { useI18n } from "../../contexts/I18nContext.jsx";
import { DARK_MODE_STYLES } from "../../constants/MapStyles.jsx";

import Nav from "../../components/Nav.jsx";
import Main from "../../components/Main.jsx";
import Spinner from "../../components/Spinner.jsx";
import ClosestMarkers from "../../components/map/ClosestMarkers.jsx";

import markers from "../../utils/MarkerUtils.jsx";

const MapView = () => {
  const { getText } = useI18n();
  const apiKey = GOOGLE_MAPS_KEY;
  const libraries = ["geometry"];
  const defaultCenter = { lat: 43.462068, lng: -3.810204 };
  const defaultZoom = 17;

  const [loading, setLoading] = useState(true);
  const [center, setCenter] = useState(defaultCenter);
  const [closestMarkers, setClosestMarkers] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(
    globalThis.matchMedia &&
      globalThis.matchMedia("(prefers-color-scheme: dark)").matches
  );

  const getCurrentLocation = useCallback(() => {
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
      alert(getText("location_not_available"));
    };

    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  }, [getText]);

  const mapOptions = {
    mapId: "map",
    defaultZoom,
    fullscreenControl: false,
    disableDefaultUI: true,
    center,
    styles: isDarkMode ? DARK_MODE_STYLES : [],
  };

  const handleApiLoaded = () => {
    setLoading(false);
  };

  const handleCameraChange = useCallback((event) => {
    const { zoom, center } = event.detail;
    setCenter(center);

    const bounds = new globalThis.google.maps.LatLngBounds(
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
          globalThis.google.maps.geometry.spherical.computeDistanceBetween(
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
    // Track map view
    trackMapView();
    
    getCurrentLocation();

    // Dark mode listener
    const darkModeQuery = globalThis.matchMedia("(prefers-color-scheme: dark)");
    const handleColorSchemeChange = (e) => setIsDarkMode(e.matches);
    darkModeQuery.addEventListener("change", handleColorSchemeChange);

    return () => {
      darkModeQuery.removeEventListener("change", handleColorSchemeChange);
    };
  }, [getCurrentLocation]);

  return (
    <Fragment>
      <Nav isHeader={false} titleText={getText("map")} />
      <Main>
        <APIProvider
          apiKey={apiKey}
          libraries={libraries}
          onLoad={handleApiLoaded}
        >
          {loading ? <Spinner /> : getMap()}
        </APIProvider>
      </Main>
    </Fragment>
  );
};

export default MapView;

import React from "react";
import type { ReactNode } from "react";
import { Fragment, useCallback, useEffect, useState } from "react";
import type { MapCameraChangedEvent } from "@vis.gl/react-google-maps";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import type { Marker } from "../../interfaces/marker";
import { GOOGLE_MAPS_KEY } from "../../utils/ApiConstants";
import { trackMapView } from "../../utils/TelemetryUtils";
import { useI18n } from "../../contexts/I18nContext";

import Nav from "../../components/Nav";
import Main from "../../components/Main";
import Spinner from "../../components/Spinner";
import ClosestMarkers from "../../components/map/ClosestMarkers";

import allMarkers from "../../utils/MarkerUtils";

interface LatLng {
  lat: number;
  lng: number;
}

type MarkerWithDistance = Marker & { centerDistance: number };

function MapView(): React.JSX.Element {
  const { getText } = useI18n();
  const apiKey = GOOGLE_MAPS_KEY ?? "";
  const libraries: string[] = ["geometry"];
  const defaultCenter: LatLng = { lat: 43.462068, lng: -3.810204 };
  const defaultZoom = 17;

  const [loading, setLoading] = useState(true);
  const [center, setCenter] = useState<LatLng>(defaultCenter);
  const [closestMarkers, setClosestMarkers] = useState<Marker[]>([]);

  const getCurrentLocation = useCallback((): void => {
    const successCallback = (position: GeolocationPosition): void => {
      setCenter({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    };

    const errorCallback = (error: GeolocationPositionError): void => {
      if (error.code === 1 || error.code === 3) {
        return;
      }
      alert(getText("location_not_available"));
    };

    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  }, [getText]);

  const handleApiLoaded = (): void => {
    setLoading(false);
  };

  const handleCameraChange = useCallback(
    (event: MapCameraChangedEvent): void => {
      const { zoom, center: eventCenter } = event.detail;
      setCenter(eventCenter);

      const bounds = new google.maps.LatLngBounds(
        {
          lat: event.detail.bounds.south,
          lng: event.detail.bounds.west,
        },
        {
          lat: event.detail.bounds.north,
          lng: event.detail.bounds.east,
        }
      );

      const metersPerPixel =
        (156543.03392 * Math.cos((eventCenter.lat * Math.PI) / 180)) /
        Math.pow(2, zoom);

      const meters = 27.5 * metersPerPixel;
      const degrees = meters / 111320;
      const adjustedCenter: LatLng = {
        lat: eventCenter.lat + degrees,
        lng: eventCenter.lng,
      };

      const nearby: MarkerWithDistance[] = allMarkers
        .filter((marker) => bounds.contains(marker.position))
        .map((marker) => {
          const centerDistance =
            google.maps.geometry.spherical.computeDistanceBetween(
              marker.position,
              adjustedCenter
            );
          return { ...marker, centerDistance };
        })
        .sort((a, b) => a.centerDistance - b.centerDistance)
        .slice(0, 10);

      setClosestMarkers(nearby);
    },
    []
  );

  const getMap = (): ReactNode => (
    <Map
      mapId="91bb8a184defe594b79354e1"
      colorScheme="FOLLOW_SYSTEM"
      defaultZoom={defaultZoom}
      fullscreenControl={false}
      disableDefaultUI={true}
      center={center}
      onCameraChanged={handleCameraChange}
      style={{ position: "absolute" }}
    >
      <ClosestMarkers markers={closestMarkers} />
    </Map>
  );

  useEffect(() => {
    trackMapView();
    getCurrentLocation();
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
}

export default MapView;

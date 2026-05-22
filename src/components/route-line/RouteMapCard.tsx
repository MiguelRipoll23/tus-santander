import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";
import { APIProvider, AdvancedMarker, Map, useMap } from "@vis.gl/react-google-maps";
import { MapPin, ChevronLeft } from "lucide-react";
import type { RouteItemTuple } from "../../types/estimations";
import type { MarkerPosition } from "../../interfaces/marker";
import { GOOGLE_MAPS_KEY } from "../../utils/ApiConstants";
import { getLineBackgroundColor } from "../../utils/LineUtils";
import { useView } from "../../contexts/ViewContext";
import { VIEW_ID_ESTIMATIONS_STOP } from "../../constants/ViewConstants";
import allMarkers from "../../utils/MarkerUtils";

import styles from "./RouteMapCard.module.css";

interface RouteMapCardProps {
  routes: RouteItemTuple[];
  activeStopId: number;
  lineLabel: string;
}

interface StopMarker {
  id: number;
  name: string;
  position: MarkerPosition;
}

interface BoundsFitterProps {
  positions: MarkerPosition[];
}

function BoundsFitter({ positions }: BoundsFitterProps): null {
  const map = useMap();

  useEffect(() => {
    if (!map || positions.length === 0) return;
    const bounds = new google.maps.LatLngBounds();
    positions.forEach((pos) => bounds.extend(pos));
    map.fitBounds(bounds, 32);
  }, [map, positions]);

  return null;
}

interface StopMarkersProps {
  markers: StopMarker[];
  activeStopId: number;
  lineColor: string;
  onMarkerClick: (stop: StopMarker) => void;
  showLabels?: boolean;
}

function StopMarkers({ markers, activeStopId, lineColor, onMarkerClick, showLabels }: StopMarkersProps): ReactNode {
  return markers.map((stop) => {
    const isActive = stop.id === activeStopId;
    return (
      <AdvancedMarker
        key={stop.id}
        position={stop.position}
        onClick={() => onMarkerClick(stop)}
        title={stop.name}
      >
        <div className="marker">
          {isActive ? (
            <div
              className={styles.activePin}
              style={{ backgroundColor: lineColor }}
            />
          ) : (
            <MapPin size={24} color="rgb(0, 112, 240)" aria-hidden="true" />
          )}
          {showLabels && <span className="markerLabel">{stop.name}</span>}
        </div>
      </AdvancedMarker>
    );
  });
}

interface RoutePolylineProps {
  path: MarkerPosition[];
  color: string;
}

function RoutePolyline({ path, color }: RoutePolylineProps): null {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    const line = new google.maps.Polyline({
      path,
      strokeColor: color,
      strokeWeight: 4,
      strokeOpacity: 0.9,
    });
    line.setMap(map);
    return () => line.setMap(null);
  }, [map, path, color]);

  return null;
}

function RouteMapCard({ routes, activeStopId, lineLabel }: RouteMapCardProps): ReactNode {
  const { setViewIdWithData } = useView();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapMounted, setMapMounted] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMapMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const apiKey = GOOGLE_MAPS_KEY ?? "";
  const lineColor = getLineBackgroundColor(lineLabel, "string");
  const defaultCenter = { lat: 43.462068, lng: -3.810204 };
  const defaultZoom = 12;

  const stopMarkers: StopMarker[] = useMemo(
    () =>
      routes.reduce<StopMarker[]>((acc, [id, name]) => {
        const found = allMarkers.find((m) => m.id === id);
        if (found) acc.push({ id, name, position: found.position });
        return acc;
      }, []),
    [routes]
  );

  const positions = useMemo(() => stopMarkers.map((m) => m.position), [stopMarkers]);

  const activeStop = stopMarkers.find((m) => m.id === activeStopId);
  const mapCenter = activeStop ? activeStop.position : defaultCenter;

  const openStop = (stop: StopMarker): void => {
    setViewIdWithData(VIEW_ID_ESTIMATIONS_STOP, {
      stopId: stop.id,
      stopName: stop.name,
    });
  };

  const handleMarkerClick = (stop: StopMarker): void => {
    if (isFullscreen) {
      openStop(stop);
    } else {
      setIsFullscreen(true);
    }
  };

  const fullscreenOverlay = createPortal(
    <div className={styles.fullscreen}>
      {mapMounted && (
        <APIProvider apiKey={apiKey}>
          <Map
            mapId="91bb8a184defe594b79354e1"
            colorScheme="FOLLOW_SYSTEM"
            defaultZoom={defaultZoom}
            defaultCenter={mapCenter}
            disableDefaultUI={true}
            fullscreenControl={false}
            gestureHandling="greedy"
            style={{ width: "100%", height: "100%" }}
          >
            <BoundsFitter positions={positions} />
            <RoutePolyline path={positions} color={lineColor} />
            <StopMarkers
              markers={stopMarkers}
              activeStopId={activeStopId}
              lineColor={lineColor}
              onMarkerClick={handleMarkerClick}
              showLabels
            />
          </Map>
        </APIProvider>
      )}
      <button
        type="button"
        className={`${styles.backBtn} liquid-glass`}
        aria-label="Back"
        onClick={() => setIsFullscreen(false)}
      >
        <ChevronLeft size={28} aria-hidden="true" />
      </button>
    </div>,
    document.body
  );

  return (
    <>
      <div
        className={styles.card}
        role="button"
        tabIndex={0}
        onClick={() => setIsFullscreen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setIsFullscreen(true);
          }
        }}
      >
        {mapMounted && (
          <APIProvider apiKey={apiKey}>
          <Map
            mapId="91bb8a184defe594b79354e1"
            colorScheme="FOLLOW_SYSTEM"
            defaultZoom={defaultZoom}
            defaultCenter={mapCenter}
            disableDefaultUI={true}
            gestureHandling="cooperative"
            style={{ width: "100%", height: "100%" }}
          >
            <BoundsFitter positions={positions} />
            <RoutePolyline path={positions} color={lineColor} />
            <StopMarkers
              markers={stopMarkers}
              activeStopId={activeStopId}
              lineColor={lineColor}
              onMarkerClick={handleMarkerClick}
            />
          </Map>
          </APIProvider>
        )}
      </div>
      {isFullscreen && fullscreenOverlay}
    </>
  );
}

export default RouteMapCard;

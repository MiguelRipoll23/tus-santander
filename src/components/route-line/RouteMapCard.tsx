import React from "react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";
import { APIProvider, AdvancedMarker, Map, useMap } from "@vis.gl/react-google-maps";
import type { RouteItemTuple } from "../../types/estimations";
import type { MarkerPosition } from "../../interfaces/marker";
import { GOOGLE_MAPS_KEY } from "../../utils/ApiConstants";
import { getLineBackgroundColor } from "../../utils/LineUtils";
import { useView } from "../../contexts/ViewContext";
import { useI18n } from "../../contexts/I18nContext";
import { VIEW_ID_ESTIMATIONS_STOP } from "../../constants/ViewConstants";
import allMarkers from "../../utils/MarkerUtils";
import MarkerMin from "../../assets/marker-min.png";

import styles from "./RouteMapCard.module.css";

interface RouteMapCardProps {
  routes: RouteItemTuple[];
  activeStopId: number;
  lineLabel: string;
  lineDestination: string;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  return null;
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

function RouteMapCard({
  routes,
  activeStopId,
  lineLabel,
  lineDestination,
}: RouteMapCardProps): ReactNode {
  const { getText } = useI18n();
  const { setViewIdWithData } = useView();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mapMounted, setMapMounted] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMapMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const apiKey = GOOGLE_MAPS_KEY ?? "";
  const lineColor = getLineBackgroundColor(lineLabel, "string");
  const defaultCenter = { lat: 43.462068, lng: -3.810204 };
  const defaultZoom = 12;

  const stopMarkers: StopMarker[] = routes.reduce<StopMarker[]>((acc, [id, name]) => {
    const found = allMarkers.find((m) => m.id === id);
    if (found) acc.push({ id, name, position: found.position });
    return acc;
  }, []);

  const positions = stopMarkers.map((m) => m.position);

  const openStop = (stop: StopMarker): void => {
    setViewIdWithData(VIEW_ID_ESTIMATIONS_STOP, {
      stopId: stop.id,
      stopName: stop.name,
    });
  };

  const renderMarkers = (): ReactNode =>
    stopMarkers.map((stop) => {
      const isActive = stop.id === activeStopId;
      return (
        <AdvancedMarker
          key={stop.id}
          position={stop.position}
          onClick={() => openStop(stop)}
        >
          {isActive ? (
            <div
              className={styles.activePin}
              style={{ backgroundColor: lineColor }}
            />
          ) : (
            <div className="marker">
              <img alt="Pin" src={MarkerMin} />
            </div>
          )}
        </AdvancedMarker>
      );
    });

  return createPortal(
    <div className={styles.sheet} data-collapsed={isCollapsed}>
      <button
        type="button"
        className={styles.sheetHandle}
        aria-label={isCollapsed ? getText("expand_map") : getText("close_map")}
        onClick={() => setIsCollapsed((c) => !c)}
      >
        <span className={styles.pill} />
        <div className={styles.sheetHeader}>
          <span className={styles.sheetTitle}>
            {lineLabel} {lineDestination.toUpperCase()}
          </span>
          <span className={styles.chevron} data-collapsed={isCollapsed}>
            ∨
          </span>
        </div>
      </button>
      <div className={styles.sheetMap}>
        {mapMounted && (
          <APIProvider apiKey={apiKey}>
            <Map
              mapId="91bb8a184defe594b79354e1"
              colorScheme="FOLLOW_SYSTEM"
              defaultZoom={defaultZoom}
              defaultCenter={defaultCenter}
              disableDefaultUI={true}
              gestureHandling="greedy"
              style={{ width: "100%", height: "100%" }}
            >
              <BoundsFitter positions={positions} />
              <RoutePolyline path={positions} color={lineColor} />
              {renderMarkers()}
            </Map>
          </APIProvider>
        )}
      </div>
    </div>,
    document.body
  );
}

export default RouteMapCard;

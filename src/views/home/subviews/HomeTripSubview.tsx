import React from "react";
import type { FormEvent } from "react";
import { Fragment, useState, useMemo } from "react";
import { ChevronRight, MapPin, Search, Clock, Bus, AlertCircle } from "lucide-react";

import { useI18n } from "../../../contexts/I18nContext";
import Nav from "../../../components/Nav";
import stopsJson from "../../../json/stops.min.json";
import type { StopTuple, StopsData } from "../../../types/stops";
import styles from "./HomeTripSubview.module.css";

const Stops = stopsJson as unknown as StopsData;

interface RouteSegment {
  type: "walk" | "bus" | "transfer";
  duration: number;
  description: string;
  busLine?: string;
  fromStop?: string;
  toStop?: string;
}

interface RouteOption {
  id: string;
  duration: number;
  departureTime: string;
  arrivalTime: string;
  segments: RouteSegment[];
  transfers: number;
}

function HomeTripSubview(): React.JSX.Element {
  const { getText } = useI18n();
  const [fromText, setFromText] = useState("");
  const [toText, setToText] = useState("");
  const [fromStopId, setFromStopId] = useState<number | null>(null);
  const [toStopId, setToStopId] = useState<number | null>(null);
  const [showFromResults, setShowFromResults] = useState(false);
  const [showToResults, setShowToResults] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<RouteOption | null>(null);

  const fromResults = useMemo<StopTuple[]>(() => {
    if (!showFromResults || fromText.length === 0) return [];
    const list: StopTuple[] = [];

    if (isNaN(Number(fromText))) {
      for (const stopKey in Stops) {
        const stop = Stops[stopKey];
        const stopName = stop[3].toLowerCase();
        const searchTerm = fromText.toLowerCase();

        if (searchTerm.length < 4) {
          if (stopName.substring(0, searchTerm.length) !== searchTerm) {
            continue;
          }
        } else if (!stopName.includes(searchTerm)) {
          continue;
        }

        list.push(stop);
        if (list.length === 6) break;
      }
    } else if (fromText in Stops) {
      list.push(Stops[fromText]);
    }

    return list;
  }, [fromText, showFromResults]);

  const toResults = useMemo<StopTuple[]>(() => {
    if (!showToResults || toText.length === 0) return [];
    const list: StopTuple[] = [];

    if (isNaN(Number(toText))) {
      for (const stopKey in Stops) {
        const stop = Stops[stopKey];
        const stopName = stop[3].toLowerCase();
        const searchTerm = toText.toLowerCase();

        if (searchTerm.length < 4) {
          if (stopName.substring(0, searchTerm.length) !== searchTerm) {
            continue;
          }
        } else if (!stopName.includes(searchTerm)) {
          continue;
        }

        list.push(stop);
        if (list.length === 6) break;
      }
    } else if (toText in Stops) {
      list.push(Stops[toText]);
    }

    return list;
  }, [toText, showToResults]);

  const generateMockRoutes = (): RouteOption[] => {
    if (!fromStopId || !toStopId) return [];

    const baseTime = new Date();
    baseTime.setMinutes(baseTime.getMinutes() + 5);

    return [
      {
        id: "route-1",
        duration: 25,
        departureTime: `${String(baseTime.getHours()).padStart(2, "0")}:${String(baseTime.getMinutes()).padStart(2, "0")}`,
        arrivalTime: `${String(baseTime.getHours()).padStart(2, "0")}:${String(baseTime.getMinutes() + 25).padStart(2, "0")}`,
        transfers: 0,
        segments: [
          {
            type: "walk",
            duration: 3,
            description: `Walk to bus stop`,
          },
          {
            type: "bus",
            duration: 22,
            description: `Bus line 1`,
            busLine: "1",
            fromStop: Stops[fromStopId]?.[3] || "Stop",
            toStop: Stops[toStopId]?.[3] || "Stop",
          },
        ],
      },
      {
        id: "route-2",
        duration: 35,
        departureTime: `${String(baseTime.getHours()).padStart(2, "0")}:${String(baseTime.getMinutes() + 15).padStart(2, "0")}`,
        arrivalTime: `${String(baseTime.getHours()).padStart(2, "0")}:${String(baseTime.getMinutes() + 50).padStart(2, "0")}`,
        transfers: 1,
        segments: [
          {
            type: "walk",
            duration: 2,
            description: `Walk to bus stop`,
          },
          {
            type: "bus",
            duration: 15,
            description: `Bus line 5`,
            busLine: "5",
            fromStop: Stops[fromStopId]?.[3] || "Stop",
            toStop: "Transfer point",
          },
          {
            type: "transfer",
            duration: 3,
            description: `Transfer to bus line 8`,
          },
          {
            type: "bus",
            duration: 15,
            description: `Bus line 8`,
            busLine: "8",
            fromStop: "Transfer point",
            toStop: Stops[toStopId]?.[3] || "Stop",
          },
        ],
      },
    ];
  };

  const routes = useMemo(generateMockRoutes, [fromStopId, toStopId]);

  const selectFromStop = (stopId: number): void => {
    setFromStopId(stopId);
    setFromText(Stops[stopId]?.[3] || "");
    setShowFromResults(false);
  };

  const selectToStop = (stopId: number): void => {
    setToStopId(stopId);
    setToText(Stops[stopId]?.[3] || "");
    setShowToResults(false);
  };

  const hasValidTrip = fromStopId !== null && toStopId !== null;

  return (
    <Fragment>
      <Nav isHeader titleText={getText("trip")} />
      <div className={styles.content}>
        {!selectedRoute ? (
          <>
            <div className={styles.searchContainer}>
              <div className={styles.inputGroup}>
                <div className={styles.inputWrapper}>
                  <MapPin size={14} className={styles.icon} aria-hidden="true" />
                  <input
                    className={styles.input}
                    type="text"
                    placeholder={getText("from")}
                    aria-label={getText("from")}
                    value={fromText}
                    onInput={(e: FormEvent<HTMLInputElement>) => {
                      setFromText(e.currentTarget.value);
                      setShowFromResults(true);
                    }}
                    onFocus={() => setShowFromResults(true)}
                  />
                </div>

                {fromResults.length > 0 && showFromResults && (
                  <div className={styles.results}>
                    {fromResults.map((result, i) => {
                      const stopId = result[0];
                      const stopName = result[3];

                      return (
                        <button
                          type="button"
                          className={styles.resultItem}
                          key={i}
                          onClick={() => selectFromStop(stopId)}
                        >
                          <Search size={14} className={styles.resultIcon} aria-hidden="true" />
                          <span>{`${stopName} (${stopId})`}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className={styles.inputGroup}>
                <div className={styles.inputWrapper}>
                  <MapPin size={14} className={styles.icon} aria-hidden="true" />
                  <input
                    className={styles.input}
                    type="text"
                    placeholder={getText("to")}
                    aria-label={getText("to")}
                    value={toText}
                    onInput={(e: FormEvent<HTMLInputElement>) => {
                      setToText(e.currentTarget.value);
                      setShowToResults(true);
                    }}
                    onFocus={() => setShowToResults(true)}
                  />
                </div>

                {toResults.length > 0 && showToResults && (
                  <div className={styles.results}>
                    {toResults.map((result, i) => {
                      const stopId = result[0];
                      const stopName = result[3];

                      return (
                        <button
                          type="button"
                          className={styles.resultItem}
                          key={i}
                          onClick={() => selectToStop(stopId)}
                        >
                          <Search size={14} className={styles.resultIcon} aria-hidden="true" />
                          <span>{`${stopName} (${stopId})`}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {hasValidTrip && (
              <div className={styles.routesContainer}>
                {routes.length === 0 ? (
                  <div className={styles.noResults}>
                    <AlertCircle size={20} className={styles.noResultsIcon} aria-hidden="true" />
                    <p>{getText("no_routes_found")}</p>
                  </div>
                ) : (
                  routes.map((route) => (
                    <div
                      key={route.id}
                      className={styles.routeCard}
                      onClick={() => setSelectedRoute(route)}
                    >
                      <div className={styles.routeHeader}>
                        <div className={styles.routeTime}>
                          <div className={styles.departure}>{route.departureTime}</div>
                          <div className={styles.durationBadge}>
                            <Clock size={12} aria-hidden="true" />
                            {route.duration} {getText("minutes")}
                          </div>
                          <div className={styles.arrival}>{route.arrivalTime}</div>
                        </div>
                        <ChevronRight size={16} className={styles.arrowIcon} aria-hidden="true" />
                      </div>

                      <div className={styles.routeDetails}>
                        {route.transfers === 0 ? (
                          <div className={styles.directRoute}>
                            <Bus size={14} aria-hidden="true" />
                            Direct route
                          </div>
                        ) : (
                          <div className={styles.transferRoute}>
                            <Bus size={14} aria-hidden="true" />
                            {route.transfers} transfer{route.transfers > 1 ? "s" : ""}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {!hasValidTrip && (
              <div className={styles.emptyState}>
                <Search size={32} className={styles.emptyIcon} aria-hidden="true" />
                <p>{getText("plan_trip")}</p>
              </div>
            )}
          </>
        ) : (
          <div className={styles.routeDetail}>
            <button
              type="button"
              className={styles.backButton}
              onClick={() => setSelectedRoute(null)}
            >
              ← {getText("back") || "Back"}
            </button>

            <div className={styles.routeDetailHeader}>
              <div className={styles.routeTimeDetail}>
                <div className={styles.departureDetail}>{selectedRoute.departureTime}</div>
                <div className={styles.durationBadgeDetail}>
                  <Clock size={14} aria-hidden="true" />
                  {selectedRoute.duration} {getText("minutes")}
                </div>
                <div className={styles.arrivalDetail}>{selectedRoute.arrivalTime}</div>
              </div>
            </div>

            <div className={styles.stepsContainer}>
              {selectedRoute.segments.map((segment, idx) => (
                <div key={idx} className={styles.stepCard}>
                  <div className={styles.stepIcon}>
                    {segment.type === "walk" && (
                      <div className={styles.walkIcon}>🚶</div>
                    )}
                    {segment.type === "bus" && (
                      <div className={styles.busIcon}>
                        <Bus size={16} aria-hidden="true" />
                      </div>
                    )}
                    {segment.type === "transfer" && (
                      <div className={styles.transferIcon}>↔</div>
                    )}
                  </div>

                  <div className={styles.stepContent}>
                    <div className={styles.stepTitle}>
                      {segment.type === "walk" && getText("walk")}
                      {segment.type === "bus" && getText("bus")}
                      {segment.type === "transfer" && getText("transfer")}
                    </div>

                    {segment.busLine && (
                      <div className={styles.busLineBadge}>{segment.busLine}</div>
                    )}

                    <div className={styles.stepDescription}>
                      {segment.description}
                    </div>

                    {segment.fromStop && segment.toStop && (
                      <div className={styles.stopInfo}>
                        <div className={styles.fromStop}>{segment.fromStop}</div>
                        <div className={styles.toStop}>{segment.toStop}</div>
                      </div>
                    )}

                    <div className={styles.stepDuration}>
                      {segment.duration} {getText("minutes")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );
}

export default HomeTripSubview;

import React from "react";
import { Fragment, useState, useRef, useCallback, useEffect } from "react";
import {
  LocateFixed,
  Search,
  X,
  Clock,
  Bus,
  Footprints,
  ArrowUpDown,
  ArrowRight,
  ChevronsRight,
  Loader,
} from "lucide-react";

import { useI18n } from "../../../contexts/I18nContext";
import Nav from "../../../components/Nav";
import stopsJson from "../../../json/stops.min.json";
import type { StopsData } from "../../../types/stops";
import { getPlacePredictions, getPlaceCoordinates, getDirections } from "../../../utils/PlacesUtils";
import type { PlacePrediction } from "../../../utils/PlacesUtils";
import { findNearestStop } from "../../../utils/StopUtils";
import type { NearestStop } from "../../../utils/StopUtils";
import { getLineBackgroundColor, getLineTextColor } from "../../../utils/LineUtils";
import styles from "./HomeTripSubview.module.css";

const Stops = stopsJson as unknown as StopsData;

interface SelectedPlace {
  name: string;
  lat: number;
  lng: number;
  nearest: NearestStop;
}

interface RouteSegment {
  type: "walk" | "bus" | "transfer";
  duration: number;
  label: string;
  busLine?: string;
  busDestination?: string;
  fromStop?: string;
  toStop?: string;
  distanceMeters?: number;
}

interface RouteOption {
  id: string;
  totalMinutes: number;
  departure: string;
  arrival: string;
  segments: RouteSegment[];
  transfers: number;
  lines: string[];
  scheduleText: string;
  etaText: string;
  serviceEndText?: string;
}

function formatTime(date: Date): string {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function formatTime12h(date: Date): string {
  const h = date.getHours() % 12 || 12;
  const m = String(date.getMinutes()).padStart(2, "0");
  const ampm = date.getHours() >= 12 ? "PM" : "AM";
  return `${h}:${m} ${ampm}`;
}

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60000);
}
interface InputFieldProps {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  onClear: () => void;
  predictions: PlacePrediction[];
  onSelect: (p: PlacePrediction) => void;
  showLocation?: boolean;
  onLocation?: () => void;
  isLocating?: boolean;
  dot?: "origin" | "destination";
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

function InputField({
  placeholder,
  value,
  onChange,
  onClear,
  predictions,
  onSelect,
  showLocation,
  onLocation,
  isLocating,
  dot,
  onKeyDown,
}: InputFieldProps): React.JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);
  const showDropdown = focused && predictions.length > 0;

  return (
    <div className={styles.fieldGroup}>
      <div className={styles.fieldRow}>
        <div className={styles.fieldDot} data-type={dot ?? "origin"} />

        <input
          ref={inputRef}
          className={styles.fieldInput}
          type="text"
          placeholder={placeholder}
          value={value}
          autoComplete="off"
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
        />

        <div className={styles.fieldActions}>
          {value.length > 0 && (
            <button
              type="button"
              className={styles.clearBtn}
              onMouseDown={(e) => {
                e.preventDefault();
                onClear();
                inputRef.current?.focus();
              }}
              aria-label="Clear"
            >
              <X size={14} aria-hidden="true" />
            </button>
          )}
          {showLocation && (
            <button
              type="button"
              className={`${styles.locateBtn} ${isLocating ? styles.locateBtnActive : ""}`}
              onMouseDown={(e) => {
                e.preventDefault();
                onLocation?.();
              }}
              aria-label="Use current location"
            >
              <LocateFixed size={16} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {showDropdown && (
        <div className={styles.dropdown}>
          {predictions.map((p) => (
            <button
              key={p.placeId}
              type="button"
              className={styles.dropdownItem}
              onMouseDown={(e) => {
                e.preventDefault();
                onSelect(p);
              }}
            >
              <Search size={13} className={styles.dropdownIcon} aria-hidden="true" />
              <div className={styles.dropdownText}>
                <span className={styles.dropdownMain}>{p.mainText}</span>
                {p.secondaryText && (
                  <span className={styles.dropdownSub}>{p.secondaryText}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function RoutePills({ segments }: { segments: RouteSegment[] }): React.JSX.Element {
  const elements: React.JSX.Element[] = [];

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];

    if (seg.type === "walk") {
      elements.push(
        <div key={`w${i}`} className={styles.pillWalk}>
          <Footprints size={12} aria-hidden="true" />
          <span>{seg.duration} min</span>
        </div>
      );
      if (i + 1 < segments.length) {
        elements.push(
          <span key={`ws${i}`} className={styles.pillSep} aria-hidden="true">▶</span>
        );
      }
    } else if (seg.type === "bus" && seg.busLine) {
      const bg = getLineBackgroundColor(seg.busLine, "string");
      const fg = getLineTextColor(seg.busLine);
      elements.push(
        <div key={`b${i}`} className={styles.pillBusLine} style={{ background: bg, color: fg }}>
          <span>{seg.busLine}</span>
        </div>
      );
      const next = segments[i + 1];
      if (!next || next.type !== "bus") {
        elements.push(
          <Bus key={`bi${i}`} size={14} className={styles.pillBusIcon} aria-hidden="true" />
        );
        if (next?.type === "walk") {
          elements.push(
            <span key={`bs${i}`} className={styles.pillSep} aria-hidden="true">▶</span>
          );
        }
      }
    } else if (seg.type === "transfer") {
      elements.push(
        <span key={`t${i}`} className={styles.pillSep} aria-hidden="true">▶</span>
      );
    }
  }

  return <div className={styles.pills}>{elements}</div>;
}

interface RouteCardProps {
  route: RouteOption;
  onClick: () => void;
}

function RouteCard({ route, onClick }: RouteCardProps): React.JSX.Element {
  return (
    <button type="button" className={styles.routeCard} onClick={onClick}>
      <div className={styles.routeCardInner}>
        <div className={styles.routeCardLeft}>
          <div className={styles.routeDurationText}>{route.totalMinutes} min</div>
          <div className={styles.routeScheduleText}>{route.scheduleText} · {route.etaText}</div>
          <RoutePills segments={route.segments} />
          {route.serviceEndText && (
            <div className={styles.routeServiceInfo}>
              <Clock size={13} aria-hidden="true" />
              <span>{route.serviceEndText}</span>
            </div>
          )}
        </div>
        <div className={styles.stepsBtn} aria-hidden="true">
          <ChevronsRight size={22} className={styles.stepsBtnIcon} />
          <span className={styles.stepsBtnLabel}>Steps</span>
        </div>
      </div>
    </button>
  );
}

interface StepRowProps {
  segment: RouteSegment;
  isLast: boolean;
}

function StepRow({ segment, isLast }: StepRowProps): React.JSX.Element {
  const lineBg = segment.busLine ? getLineBackgroundColor(segment.busLine, "string") : "";
  const lineFg = segment.busLine ? getLineTextColor(segment.busLine) : "";

  return (
    <div className={styles.step}>
      <div className={styles.stepTimeline}>
        <div
          className={styles.stepDot}
          style={
            segment.type === "bus" && lineBg
              ? { background: lineBg }
              : undefined
          }
          data-type={segment.type}
        />
        {!isLast && (
          <div
            className={styles.stepLine}
            data-type={segment.type}
            style={segment.type === "bus" && lineBg ? { background: lineBg } : undefined}
          />
        )}
      </div>

      <div className={styles.stepBody}>
        {segment.type === "walk" && (
          <div className={styles.stepCard}>
            <div className={styles.stepCardAccent} data-type="walk" />
            <div className={styles.stepCardContent}>
              <div className={styles.stepWalkHeader}>
                <Footprints size={15} className={styles.stepWalkIcon} aria-hidden="true" />
                <span className={styles.stepCardTitle}>
                  Walk{segment.distanceMeters ? ` · ${segment.distanceMeters} m` : ""}
                </span>
              </div>
              <div className={styles.stepCardSub}>{segment.label}</div>
              <div className={styles.stepCardTime}>{segment.duration} minutes</div>
            </div>
          </div>
        )}

        {segment.type === "bus" && segment.busLine && (
          <div className={styles.stepCard}>
            <div
              className={styles.stepCardAccent}
              data-type="bus"
              style={{ background: lineBg }}
            />
            <div className={styles.stepCardContent}>
              <div className={styles.stepWalkHeader}>
                <Bus size={15} style={{ color: lineBg }} aria-hidden="true" />
                <span className={styles.stepCardTitle}>
                  {segment.busLine}{segment.busDestination ? ` · towards ${segment.busDestination}` : ""}
                </span>
              </div>
              <div className={styles.stepCardSub}>
                Board at <strong>{segment.fromStop}</strong>
              </div>
              <div className={styles.stepCardSub}>
                Alight at <strong>{segment.toStop}</strong>
              </div>
              <div className={styles.stepCardTime}>{segment.duration} minutes</div>
            </div>
          </div>
        )}

        {segment.type === "transfer" && (
          <div className={styles.stepCard}>
            <div className={styles.stepCardAccent} data-type="transfer" />
            <div className={styles.stepCardContent}>
              <div className={styles.stepWalkHeader}>
                <ArrowUpDown size={15} className={styles.stepTransferIcon} aria-hidden="true" />
                <span className={styles.stepCardTitle}>Transfer</span>
              </div>
              <div className={styles.stepCardSub}>{segment.label}</div>
              <div className={styles.stepCardTime}>{segment.duration} minutes</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function HomeTripSubview(): React.JSX.Element {
  const { getText } = useI18n();

  const [fromText, setFromText] = useState("");
  const [toText, setToText] = useState("");
  const [fromPreds, setFromPreds] = useState<PlacePrediction[]>([]);
  const [toPreds, setToPreds] = useState<PlacePrediction[]>([]);
  const [fromPlace, setFromPlace] = useState<SelectedPlace | null>(null);
  const [toPlace, setToPlace] = useState<SelectedPlace | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<RouteOption | null>(null);
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(false);
  const [routesError, setRoutesError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchRoutes = async () => {
      if (!fromPlace || !toPlace) {
        if (!cancelled) {
          setRoutes([]);
          setRoutesError(false);
        }
        return;
      }

      if (!cancelled) setIsLoadingRoutes(true);
      const directionsResult = await getDirections(
        { lat: fromPlace.lat, lng: fromPlace.lng },
        { lat: toPlace.lat, lng: toPlace.lng }
      );

      if (cancelled) return;

      if (!directionsResult || !directionsResult.routes) {
        setRoutes([]);
        setIsLoadingRoutes(false);
        setRoutesError(!directionsResult);
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newRoutes = directionsResult.routes.map((route: any, routeIdx: number) => {
        const segments: RouteSegment[] = [];
        let totalSeconds = 0;
        const lines = new Set<string>();
        let routeDeparture: Date | null = null;
        let routeArrival: Date | null = null;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        route.legs?.forEach((leg: any) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          leg.steps?.forEach((step: any) => {
            const stepDurationSeconds = Math.round((step.staticDurationMillis ?? 0) / 1000);
            totalSeconds += stepDurationSeconds;

            if (step.travelMode === "TRANSIT" && step.transitDetails) {
              const transit = step.transitDetails;
              const lineNumber = transit.transitLine?.nameShort || transit.transitLine?.name || "";
              const headsign = transit.headsign || "";
              const fromStop = transit.departureStop?.name || "";
              const toStop = transit.arrivalStop?.name || "";
              const duration = Math.ceil(stepDurationSeconds / 60);

              if (!routeDeparture && transit.departureTime) {
                routeDeparture = new Date(transit.departureTime);
              }
              if (transit.arrivalTime) {
                routeArrival = new Date(transit.arrivalTime);
              }

              if (lineNumber) {
                lines.add(lineNumber);
                segments.push({
                  type: "bus",
                  duration,
                  label: `Bus ${lineNumber}`,
                  busLine: lineNumber,
                  busDestination: headsign,
                  fromStop,
                  toStop,
                });
              }
            } else if (step.travelMode === "WALK") {
              const duration = Math.ceil(stepDurationSeconds / 60);
              const rawInstructions = step.navigationInstruction?.instructions ?? "";
              const label = new DOMParser().parseFromString(rawInstructions, "text/html").body.textContent || "Walk";
              segments.push({
                type: "walk",
                duration,
                label,
                distanceMeters: step.distanceMeters,
              });
            }
          });
        });

        const totalMinutes = Math.ceil(totalSeconds / 60);
        const departure = routeDeparture || new Date();
        const arrival = routeArrival || addMinutes(departure, totalMinutes);

        return {
          id: segments.length > 0
            ? segments.map((s) => s.type === "bus" ? `${s.busLine ?? ""}:${s.fromStop ?? ""}>${s.toStop ?? ""}` : s.type).join("|")
            : `route-${routeIdx}`,
          totalMinutes,
          departure: formatTime(departure),
          arrival: formatTime(arrival),
          segments,
          transfers: Math.max(0, segments.filter((s) => s.type === "bus").length - 1),
          lines: Array.from(lines),
          scheduleText: `Depart at ${formatTime(departure)}`,
          etaText: `${formatTime12h(arrival)} ETA`,
        };
      });

      if (!cancelled) {
        setRoutes(newRoutes);
        setIsLoadingRoutes(false);
        setRoutesError(false);
      }
    };

    void fetchRoutes();

    return () => {
      cancelled = true;
    };
  }, [fromPlace, toPlace]);

  const fetchFromPreds = useCallback(async (value: string) => {
    const preds = await getPlacePredictions(value);
    setFromPreds(preds);
  }, []);

  const fetchToPreds = useCallback(async (value: string) => {
    const preds = await getPlacePredictions(value);
    setToPreds(preds);
  }, []);

  const handleFromChange = (v: string): void => {
    setFromText(v);
    setFromPlace(null);
    if (v.length > 1) void fetchFromPreds(v);
    else setFromPreds([]);
  };

  const handleToChange = (v: string): void => {
    setToText(v);
    setToPlace(null);
    if (v.length > 1) void fetchToPreds(v);
    else setToPreds([]);
  };

  const resolvePlace = async (pred: PlacePrediction): Promise<SelectedPlace | null> => {
    const coords = await getPlaceCoordinates(pred);
    if (!coords) return null;
    const nearest = findNearestStop(coords.lat, coords.lng, Stops);
    return { name: pred.mainText, lat: coords.lat, lng: coords.lng, nearest };
  };

  const selectFrom = async (pred: PlacePrediction): Promise<void> => {
    setFromText(pred.mainText);
    setFromPreds([]);
    const place = await resolvePlace(pred);
    if (place) setFromPlace(place);
  };

  const selectTo = async (pred: PlacePrediction): Promise<void> => {
    setToText(pred.mainText);
    setToPreds([]);
    const place = await resolvePlace(pred);
    if (place) {
      setToPlace(place);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleToKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      if (toPreds.length > 0) {
        void selectTo(toPreds[0]);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handleLocate = (): void => {
    if (!navigator.geolocation) {
      setLocationError(getText("location_not_available"));
      return;
    }
    setIsLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        const nearest = findNearestStop(lat, lng, Stops);
        setFromText(getText("current_location"));
        setFromPlace({ name: getText("current_location"), lat, lng, nearest });
        setFromPreds([]);
        setIsLocating(false);
      },
      () => {
        setLocationError(getText("location_not_available"));
        setIsLocating(false);
      },
      { timeout: 10000 }
    );
  };

  const swapPlaces = (): void => {
    setFromText(toText);
    setToText(fromText);
    setFromPlace(toPlace);
    setToPlace(fromPlace);
    setFromPreds([]);
    setToPreds([]);
  };

  const hasValidTrip = fromPlace !== null && toPlace !== null;

  // ── Journey detail view ──────────────────────────────────────────────────
  if (selectedRoute) {
    return (
      <Fragment>
        <Nav
          isHeader={false}
          titleText={toPlace?.name || getText("trip")}
          onBack={() => setSelectedRoute(null)}
        />
        <div className={styles.detailContent}>

          <div className={styles.stepsContainer}>
            {selectedRoute.segments.map((seg, i) => (
              <StepRow
                key={i}
                segment={seg}
                isLast={i === selectedRoute.segments.length - 1}
              />
            ))}
            <div className={styles.arriveRow}>
              <div className={styles.arriveDot} />
              <span className={styles.arriveLabel}>Arrive at {selectedRoute.arrival}</span>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }

  // ── Search + route list view ─────────────────────────────────────────────
  return (
    <Fragment>
      <Nav isHeader titleText={getText("trip")} />

      <div className={styles.stickySearch}>
        <div className={styles.searchCard}>
          <InputField
            placeholder={getText("from")}
            value={fromText}
            onChange={handleFromChange}
            onClear={() => { setFromText(""); setFromPlace(null); setFromPreds([]); }}
            predictions={fromPreds}
            onSelect={(p) => void selectFrom(p)}
            showLocation
            onLocation={handleLocate}
            isLocating={isLocating}
            dot="origin"
          />

          <div className={styles.fieldsDivider}>
            <div className={styles.dividerLine} />
            <button
              type="button"
              className={styles.swapBtn}
              onClick={swapPlaces}
              aria-label="Swap"
            >
              <ArrowUpDown size={15} aria-hidden="true" />
            </button>
          </div>

          <InputField
            placeholder={getText("to")}
            value={toText}
            onChange={handleToChange}
            onClear={() => { setToText(""); setToPlace(null); setToPreds([]); }}
            predictions={toPreds}
            onSelect={(p) => void selectTo(p)}
            dot="destination"
            onKeyDown={handleToKeyDown}
          />
        </div>
      </div>

      <div className={styles.content}>
        {locationError && (
          <div className={styles.errorBanner}>{locationError}</div>
        )}

        {hasValidTrip && isLoadingRoutes && (
          <div className={styles.loadingContainer}>
            <Loader size={32} className={styles.loadingSpinner} aria-hidden="true" />
            <p className={styles.loadingText}>{getText("trip_finding_routes")}</p>
          </div>
        )}

        {hasValidTrip && !isLoadingRoutes && routesError && (
          <div className={styles.errorContainer}>
            <p className={styles.errorText}>{getText("trip_routes_error")}</p>
            <button
              type="button"
              className={styles.retryBtn}
              onClick={() => {
                if (fromPlace && toPlace) {
                  setIsLoadingRoutes(true);
                  setRoutesError(false);
                  void getDirections(
                    { lat: fromPlace.lat, lng: fromPlace.lng },
                    { lat: toPlace.lat, lng: toPlace.lng }
                  )
                    .then((result) => {
                      if (result?.routes) {
                        setRoutes([]);
                        setRoutesError(true);
                      }
                    })
                    .finally(() => setIsLoadingRoutes(false));
                }
              }}
            >
              {getText("try_again")}
            </button>
          </div>
        )}

        {hasValidTrip && !isLoadingRoutes && !routesError && routes.length > 0 && (
          <div className={styles.routesList}>
            {routes.map((route) => (
              <RouteCard
                key={route.id}
                route={route}
                onClick={() => setSelectedRoute(route)}
              />
            ))}
          </div>
        )}

        {hasValidTrip && !isLoadingRoutes && !routesError && routes.length === 0 && (
          <div className={styles.emptyRoutes}>
            <p className={styles.emptyRoutesText}>{getText("trip_no_routes")}</p>
          </div>
        )}
      </div>
    </Fragment>
  );
}

export default HomeTripSubview;

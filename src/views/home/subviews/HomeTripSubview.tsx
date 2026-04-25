import React from "react";
import { Fragment, useState, useMemo, useRef, useCallback } from "react";
import {
  LocateFixed,
  Search,
  X,
  Clock,
  Bus,
  Footprints,
  ArrowUpDown,
  CircleDot,
  Navigation2,
  ChevronRight,
} from "lucide-react";

import { useI18n } from "../../../contexts/I18nContext";
import Nav from "../../../components/Nav";
import stopsJson from "../../../json/stops.min.json";
import type { StopsData } from "../../../types/stops";
import { getPlacePredictions, getPlaceCoordinates } from "../../../utils/PlacesUtils";
import type { PlacePrediction } from "../../../utils/PlacesUtils";
import { findNearestStop } from "../../../utils/StopUtils";
import type { NearestStop } from "../../../utils/StopUtils";
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
}

function formatTime(date: Date): string {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60000);
}

function buildRoutes(from: SelectedPlace, to: SelectedPlace): RouteOption[] {
  const now = new Date();
  const busSpeedMps = 5.5; // 20 km/h average urban bus
  const fromToStopMeters = from.nearest.distanceMeters;
  const toStopToDestMeters = to.nearest.distanceMeters;
  const stopToStopMeters = Math.sqrt(
    Math.pow((from.nearest.stop[1] - to.nearest.stop[1]) * 111000, 2) +
      Math.pow((from.nearest.stop[2] - to.nearest.stop[2]) * 72000, 2)
  );
  const busDurationMin = Math.max(4, Math.ceil(stopToStopMeters / (busSpeedMps * 60)));
  const walkToDep = from.nearest.walkingMinutes;
  const walkToArr = to.nearest.walkingMinutes;

  const dep1 = addMinutes(now, 3);
  const total1 = walkToDep + busDurationMin + walkToArr;

  const dep2 = addMinutes(now, 9);
  const halfBus = Math.ceil(busDurationMin / 2);
  const total2 = walkToDep + halfBus + 3 + halfBus + walkToArr;

  return [
    {
      id: "r1",
      totalMinutes: total1,
      departure: formatTime(dep1),
      arrival: formatTime(addMinutes(dep1, total1)),
      transfers: 0,
      lines: ["1"],
      segments: [
        {
          type: "walk",
          duration: walkToDep,
          label: from.nearest.stop[3],
          distanceMeters: Math.round(fromToStopMeters),
        },
        {
          type: "bus",
          duration: busDurationMin,
          label: "Línea 1",
          busLine: "1",
          fromStop: from.nearest.stop[3],
          toStop: to.nearest.stop[3],
        },
        {
          type: "walk",
          duration: walkToArr,
          label: to.name,
          distanceMeters: Math.round(toStopToDestMeters),
        },
      ],
    },
    {
      id: "r2",
      totalMinutes: total2,
      departure: formatTime(dep2),
      arrival: formatTime(addMinutes(dep2, total2)),
      transfers: 1,
      lines: ["3", "7"],
      segments: [
        {
          type: "walk",
          duration: walkToDep,
          label: from.nearest.stop[3],
          distanceMeters: Math.round(fromToStopMeters),
        },
        {
          type: "bus",
          duration: halfBus,
          label: "Línea 3",
          busLine: "3",
          fromStop: from.nearest.stop[3],
          toStop: "Jardines de Pereda",
        },
        {
          type: "transfer",
          duration: 3,
          label: "Jardines de Pereda",
        },
        {
          type: "bus",
          duration: halfBus,
          label: "Línea 7",
          busLine: "7",
          fromStop: "Jardines de Pereda",
          toStop: to.nearest.stop[3],
        },
        {
          type: "walk",
          duration: walkToArr,
          label: to.name,
          distanceMeters: Math.round(toStopToDestMeters),
        },
      ],
    },
  ];
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
  autoFocus?: boolean;
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
  autoFocus,
}: InputFieldProps): React.JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);
  const showDropdown = focused && predictions.length > 0;

  return (
    <div className={styles.fieldGroup}>
      <div className={`${styles.fieldRow} ${focused ? styles.fieldRowFocused : ""}`}>
        <div className={styles.fieldDot} data-type={dot ?? "origin"} />

        <input
          ref={inputRef}
          className={styles.fieldInput}
          type="text"
          placeholder={placeholder}
          value={value}
          autoComplete="off"
          autoFocus={autoFocus}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          onChange={(e) => onChange(e.target.value)}
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
  return (
    <div className={styles.pills}>
      {segments.map((seg, i) => (
        <div key={i} className={styles.pill} data-type={seg.type}>
          {seg.type === "walk" && <span>Walk</span>}
          {seg.type === "bus" && seg.busLine && (
            <span className={styles.pillLine}>Line {seg.busLine}</span>
          )}
          {seg.type === "transfer" && <span>Transfer</span>}
          <span>{seg.duration}m</span>
        </div>
      ))}
    </div>
  );
}

interface RouteCardProps {
  route: RouteOption;
  getText: (k: string) => string;
  onClick: () => void;
}

function RouteCard({ route, onClick }: RouteCardProps): React.JSX.Element {
  return (
    <button type="button" className={styles.routeCard} onClick={onClick}>
      <div className={styles.routeCardInner}>
        <div className={styles.routeCardLeft}>
          <RoutePills segments={route.segments} />
          <div className={styles.routeCardTimes}>
            <span className={styles.routeDepTime}>{route.departure}</span>
            <span className={styles.routeTimeSep}>→</span>
            <span className={styles.routeArrTime}>{route.arrival}</span>
          </div>
        </div>
        <div className={styles.routeCardRight}>
          <div className={styles.routeDuration}>
            <Clock size={12} aria-hidden="true" />
            <span>{route.totalMinutes}m</span>
          </div>
          <ChevronRight size={16} className={styles.routeChevron} aria-hidden="true" />
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
  return (
    <div className={styles.step}>
      <div className={styles.stepTimeline}>
        <div className={styles.stepDot} data-type={segment.type} />
        {!isLast && <div className={styles.stepLine} data-type={segment.type} />}
      </div>
      <div className={styles.stepBody}>
        {segment.type === "walk" && (
          <div className={styles.stepCard} data-type="walk">
            <div className={styles.stepCardContent}>
              <div className={styles.stepCardTitle}>
                Walk{segment.distanceMeters ? ` ${segment.distanceMeters} m` : ""}
              </div>
              <div className={styles.stepCardSub}>{segment.label}</div>
              <div className={styles.stepCardTime}>{segment.duration} minutes</div>
            </div>
          </div>
        )}
        {segment.type === "bus" && (
          <div className={styles.stepCard} data-type="bus">
            <div className={styles.stepCardContent}>
              <div className={styles.stepCardTitleRow}>
                <div className={styles.lineBadge}>Line {segment.busLine}</div>
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
          <div className={styles.stepCard} data-type="transfer">
            <div className={styles.stepCardContent}>
              <div className={styles.stepCardTitle}>Transfer</div>
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

  const routes = useMemo<RouteOption[]>(() => {
    if (!fromPlace || !toPlace) return [];
    return buildRoutes(fromPlace, toPlace);
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

  const resolvePlace = async (
    pred: PlacePrediction
  ): Promise<SelectedPlace | null> => {
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
    if (place) setToPlace(place);
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

  if (selectedRoute) {
    return (
      <Fragment>
        <Nav isHeader titleText={getText("trip")} />
        <div className={styles.detailContent}>
          <div className={styles.detailSummary}>
            <div className={styles.detailSummaryRow}>
              <div className={styles.detailTimes}>
                <span className={styles.detailDep}>{selectedRoute.departure}</span>
                <span className={styles.detailSep}>→</span>
                <span className={styles.detailArr}>{selectedRoute.arrival}</span>
              </div>
              <div className={styles.detailDuration}>
                <Clock size={13} aria-hidden="true" />
                {selectedRoute.totalMinutes} minutes
              </div>
            </div>
            <div className={styles.detailRoute}>
              <CircleDot size={13} className={styles.detailRouteIcon} aria-hidden="true" />
              <span className={styles.detailFromName}>{fromPlace?.name}</span>
              <Navigation2 size={13} className={styles.detailRouteIcon} aria-hidden="true" />
              <span className={styles.detailToName}>{toPlace?.name}</span>
            </div>
          </div>

          <div className={styles.stepsContainer}>
            {selectedRoute.segments.map((seg, i) => (
              <StepRow
                key={i}
                segment={seg}
                isLast={i === selectedRoute.segments.length - 1}
              />
            ))}
            <div className={styles.arriveRow}>
              <span className={styles.arriveLabel}>Arrive at {selectedRoute.arrival}</span>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <Nav isHeader titleText={getText("trip")} />
      <div className={styles.content}>

        <div className={styles.searchCard}>
          <div className={styles.searchFields}>
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
              autoFocus={false}
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
            />
          </div>
        </div>

        {locationError && (
          <div className={styles.errorBanner}>{locationError}</div>
        )}

        {!hasValidTrip && !fromText && !toText && (
          <div className={styles.emptyState}>
            <Bus size={36} className={styles.emptyIcon} aria-hidden="true" />
            <p className={styles.emptyTitle}>{getText("plan_trip")}</p>
            <p className={styles.emptyHint}>
              {getText("from")} · {getText("to")}
            </p>
          </div>
        )}

        {hasValidTrip && (
          <div className={styles.routesList}>
            {routes.map((route) => (
              <RouteCard
                key={route.id}
                route={route}
                getText={getText}
                onClick={() => setSelectedRoute(route)}
              />
            ))}
          </div>
        )}
      </div>
    </Fragment>
  );
}

export default HomeTripSubview;

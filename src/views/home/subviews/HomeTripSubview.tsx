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
  ArrowRight,
  ChevronsRight,
} from "lucide-react";

import { useI18n } from "../../../contexts/I18nContext";
import Nav from "../../../components/Nav";
import stopsJson from "../../../json/stops.min.json";
import type { StopsData } from "../../../types/stops";
import { getPlacePredictions, getPlaceCoordinates } from "../../../utils/PlacesUtils";
import type { PlacePrediction } from "../../../utils/PlacesUtils";
import { findNearestStop } from "../../../utils/StopUtils";
import type { NearestStop } from "../../../utils/StopUtils";
import { getLineBackgroundColor, getLineTextColor } from "../../../utils/LineUtils";

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

function buildRoutes(from: SelectedPlace, to: SelectedPlace): RouteOption[] {
  const now = new Date();
  const busSpeedMps = 5.5;
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
      scheduleText: `Bus scheduled in ${3 + walkToDep} min`,
      etaText: `${formatTime12h(addMinutes(dep1, total1))} ETA`,
      serviceEndText: `Service ends at ${formatTime12h(addMinutes(dep1, total1 + 42))}`,
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
          label: "Bus 1",
          busLine: "1",
          busDestination: "Estación",
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
      scheduleText: `Bus scheduled in ${9 + walkToDep} min`,
      etaText: `${formatTime12h(addMinutes(dep2, total2))} ETA`,
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
          label: "Bus 3",
          busLine: "3",
          busDestination: "Avenida",
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
          label: "Bus 7",
          busLine: "7",
          busDestination: "Estación",
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
    <div className="relative">
      <div className="flex items-center gap-2.5 p-3">
        <div
          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          data-type={dot ?? "origin"}
          style={{
            backgroundColor: (dot ?? "origin") === "origin" ? "var(--color-blue)" : "#ff3b30",
          }}
        />

        <input
          ref={inputRef}
          className="flex-1 border-0 outline-none bg-transparent text-base text-black placeholder:text-gray-500 dark:text-white min-w-0"
          type="text"
          placeholder={placeholder}
          value={value}
          autoComplete="off"
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
        />

        <div className="flex items-center gap-1 flex-shrink-0">
          {value.length > 0 && (
            <button
              type="button"
              className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-500 text-white flex-shrink-0"
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
              className={`flex items-center justify-center text-blue-600 p-1 rounded-md ${isLocating ? "opacity-50" : ""}`}
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
        <div className="absolute bottom-full top-auto left-0 right-0 bg-white dark:bg-gray-700 rounded-3xl border border-black/10 dark:border-white/10 z-50 overflow-hidden">
          {predictions.map((p) => (
            <button
              key={p.placeId}
              type="button"
              className="flex items-start gap-2.5 py-2.75 px-3.5 w-full text-left border-b border-black/5 dark:border-white/6 last:border-b-0"
              onMouseDown={(e) => {
                e.preventDefault();
                onSelect(p);
              }}
            >
              <Search size={13} className="text-gray-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-sm text-black dark:text-white font-medium whitespace-nowrap overflow-hidden text-ellipsis">{p.mainText}</span>
                {p.secondaryText && (
                  <span className="text-xs text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis">{p.secondaryText}</span>
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
        <div key={`w${i}`} className="flex items-center gap-1 py-1 px-2.5 rounded-full text-xs font-bold bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
          <Footprints size={12} aria-hidden="true" />
          <span>{seg.duration} min</span>
        </div>
      );
      if (i + 1 < segments.length) {
        elements.push(
          <span key={`ws${i}`} className="text-xs text-gray-500 dark:text-gray-400 leading-none" aria-hidden="true">▶</span>
        );
      }
    } else if (seg.type === "bus" && seg.busLine) {
      const bg = getLineBackgroundColor(seg.busLine, "string");
      const fg = getLineTextColor(seg.busLine);
      elements.push(
        <div key={`b${i}`} className="flex items-center justify-center py-1 px-2 rounded text-sm font-bold min-w-6.5" style={{ background: bg, color: fg }}>
          <span>{seg.busLine}</span>
        </div>
      );
      const next = segments[i + 1];
      if (!next || next.type !== "bus") {
        elements.push(
          <Bus key={`bi${i}`} size={14} className="text-gray-500 dark:text-gray-400" aria-hidden="true" />
        );
        if (next?.type === "walk") {
          elements.push(
            <span key={`bs${i}`} className="text-xs text-gray-500 dark:text-gray-400 leading-none" aria-hidden="true">▶</span>
          );
        }
      }
    } else if (seg.type === "transfer") {
      elements.push(
        <span key={`t${i}`} className="text-xs text-gray-500 dark:text-gray-400 leading-none" aria-hidden="true">▶</span>
      );
    }
  }

  return <div className="flex items-center gap-1.25 flex-wrap">{elements}</div>;
}

interface RouteCardProps {
  route: RouteOption;
  onClick: () => void;
}

function RouteCard({ route, onClick }: RouteCardProps): React.JSX.Element {
  return (
    <button type="button" className="block w-full text-left bg-blue-600/10 dark:bg-blue-600/8 rounded-4xl p-4 transition-transform duration-150 active:scale-98" onClick={onClick}>
      <div className="flex items-stretch gap-3">
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <div className="text-3xl font-bold text-black dark:text-white leading-tight">{route.totalMinutes} min</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 leading-snug">{route.scheduleText} · {route.etaText}</div>
          <RoutePills segments={route.segments} />
          {route.serviceEndText && (
            <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 mt-0.5">
              <Clock size={13} aria-hidden="true" />
              <span>{route.serviceEndText}</span>
            </div>
          )}
        </div>
        <div className="flex flex-col items-center justify-center bg-transparent rounded-3.5 p-1 gap-0 flex-shrink-0 min-w-auto" aria-hidden="true">
          <ChevronsRight size={22} className="text-blue-600" />
          <span className="hidden">Steps</span>
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
    <div className="flex">
      <div className="flex flex-col items-center w-8 flex-shrink-0 pb-3">
        <div
          className="w-3 h-3 rounded-full flex-shrink-0 mt-2 z-1"
          style={{
            background:
              segment.type === "walk"
                ? "#aeaeb2"
                : segment.type === "bus"
                  ? "var(--color-blue)"
                  : "#ff9500",
          }}
          data-type={segment.type}
        />
        {!isLast && (
          <div
            className="w-0.5 flex-1 min-h-5 m-1"
            data-type={segment.type}
            style={{
              background:
                segment.type === "walk"
                  ? "repeating-linear-gradient(to bottom, #aeaeb2 0px, #aeaeb2 4px, transparent 4px, transparent 8px)"
                  : segment.type === "bus"
                    ? "rgba(0, 112, 240, 0.5)"
                    : "rgba(255, 149, 0, 0.5)",
            }}
          />
        )}
      </div>

      <div className="flex-1 pb-3 pl-2 min-w-0">
        {segment.type === "walk" && (
          <div className="bg-gray-100 dark:bg-gray-800 rounded-3xl overflow-hidden flex">
            <div className="w-1 flex-shrink-0 bg-gray-500" />
            <div className="p-2.5 pb-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Footprints size={15} className="text-gray-600 dark:text-gray-400 flex-shrink-0" aria-hidden="true" />
                <span className="text-sm font-bold text-black dark:text-white">
                  Walk{segment.distanceMeters ? ` · ${segment.distanceMeters} m` : ""}
                </span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{segment.label}</div>
              <div className="text-sm text-blue-600 font-bold mt-1.5">{segment.duration} minutes</div>
            </div>
          </div>
        )}

        {segment.type === "bus" && segment.busLine && (
          <div className="bg-gray-100 dark:bg-gray-800 rounded-3xl overflow-hidden flex">
            <div className="w-1 flex-shrink-0" style={{ background: lineBg }} />
            <div className="p-2.5 pb-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Bus size={15} style={{ color: lineBg }} aria-hidden="true" />
                <span className="text-sm font-bold text-black dark:text-white">
                  {segment.busLine}{segment.busDestination ? ` · towards ${segment.busDestination}` : ""}
                </span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Board at <strong className="text-black dark:text-white font-bold">{segment.fromStop}</strong>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Alight at <strong className="text-black dark:text-white font-bold">{segment.toStop}</strong>
              </div>
              <div className="text-sm text-blue-600 font-bold mt-1.5">{segment.duration} minutes</div>
            </div>
          </div>
        )}

        {segment.type === "transfer" && (
          <div className="bg-gray-100 dark:bg-gray-800 rounded-3xl overflow-hidden flex">
            <div className="w-1 flex-shrink-0 bg-orange-500" />
            <div className="p-2.5 pb-3">
              <div className="flex items-center gap-1.5 mb-1">
                <ArrowUpDown size={15} className="text-orange-500 flex-shrink-0" aria-hidden="true" />
                <span className="text-sm font-bold text-black dark:text-white">Transfer</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{segment.label}</div>
              <div className="text-sm text-blue-600 font-bold mt-1.5">{segment.duration} minutes</div>
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
        <div className="py-18 px-3.5 pb-30">
          <div className="flex flex-col">
            {selectedRoute.segments.map((seg, i) => (
              <StepRow
                key={i}
                segment={seg}
                isLast={i === selectedRoute.segments.length - 1}
              />
            ))}
            <div className="flex items-center gap-2.5 pt-3">
              <div className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0" />
              <span className="text-sm font-bold text-green-500">Arrive at {selectedRoute.arrival}</span>
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

      <div className="fixed bottom-[calc(var(--safe-area-inset-bottom,0px)+30rem)] left-0 right-0 z-8 px-3.5">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-4xl overflow-visible">
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

          <div className="flex items-center px-3.5 gap-2.5">
            <div className="flex-1 h-px bg-black/10 dark:bg-white/10 ml-5" />
            <button
              type="button"
              className="flex items-center justify-center w-7 h-7 rounded-full text-blue-600 bg-blue-600/12 flex-shrink-0 transition-transform duration-200 active:rotate-180"
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

      <div className="flex flex-col min-h-[calc(100svh-25px)] px-3.5 pb-60">
        {locationError && (
          <div className="bg-red-600/12 text-red-600 rounded-2.5 p-2.5 text-sm mb-3">{locationError}</div>
        )}

        {!hasValidTrip && !fromText && !toText && (
          <div className="flex-1 flex flex-col items-center justify-center p-5 text-center">
            <Bus size={36} className="text-gray-500 dark:text-gray-400 mb-3.5 opacity-40" aria-hidden="true" />
            <p className="text-lg font-bold text-gray-700 dark:text-gray-300 m-0 mb-1.5">{getText("plan_trip")}</p>
            <p className="text-sm text-gray-500 m-0">
              {getText("trip_empty_hint")}
            </p>
          </div>
        )}

        {hasValidTrip && (
          <div className="flex flex-col gap-3">
            {routes.map((route) => (
              <RouteCard
                key={route.id}
                route={route}
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

import React from "react";
import { Fragment, useCallback, useEffect, useState } from "react";
import type { RouteItemTuple } from "../../types/estimations";
import type { RouteViewData } from "../../interfaces/view";
import { useView } from "../../contexts/ViewContext";
import { getLineBackgroundColor } from "../../utils/LineUtils";
import { trackRouteView } from "../../utils/TelemetryUtils";
import {
  API_HOST,
  API_ROUTES_GET_COMPACT_PATH,
} from "../../utils/ApiConstants";

import Main from "../../components/Main";
import Nav from "../../components/Nav";
import Spinner from "../../components/Spinner";
import ErrorDisplay from "../../components/Error";
import StopLines from "../../components/StopLines";
import { useI18n } from "../../contexts/I18nContext";

import styles from "./RouteLineView.module.css";

function RouteLineView(): React.JSX.Element {
  const { getText } = useI18n();
  const { data } = useView();
  // Router guarantees this view only renders when viewId === VIEW_ID_ROUTE_LINE
  const { stopId, lineLabel, lineDestination } = data as RouteViewData;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [routes, setRoutes] = useState<RouteItemTuple[]>([]);

  const color = getLineBackgroundColor(lineLabel, "string");

  const getStops = useCallback((): void => {
    fetch(API_HOST + API_ROUTES_GET_COMPACT_PATH, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        stopId,
        lineLabel,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json() as Promise<RouteItemTuple[]>;
      })
      .then((responseData) => {
        if (responseData.length === 0) {
          throw new Error("Empty response");
        }
        setRoutes(responseData);
      })
      .catch((err: unknown) => {
        console.error(err);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [stopId, lineLabel]);

  const isActive = (itemStopId: number): boolean => itemStopId === stopId;

  useEffect(() => {
    document
      .querySelector("#stop-active")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [routes]);

  useEffect(() => {
    trackRouteView(lineLabel, lineDestination);
    getStops();
  }, [getStops, lineLabel, lineDestination]);

  const refreshContent = (): void => {
    setLoading(true);
    setError(false);
    setRoutes([]);
    getStops();
  };

  return (
    <Fragment>
      <Nav
        isHeader={false}
        titleText={`${lineLabel} ${lineDestination.toUpperCase()}`}
      />
      <Main paddingTop="64px" paddingBottom="40px">
        {loading && <Spinner />}
        {error && (
          <ErrorDisplay
            errorText={getText("no_available")}
            retryText={getText("try_again")}
            retryAction={refreshContent}
          />
        )}
        <ul className={styles.routeLineList}>
          {routes.map((item, i) => {
            const [itemStopId, stopName, stopLines] = item;
            const active = isActive(itemStopId);

            return (
              <li
                key={i}
                className={styles.stopItem}
                id={active ? "stop-active" : undefined}
                style={{
                  "--line-color": color,
                  "--active-color": active ? color : "#fff",
                  "--active-color-dark": active ? color : "#000",
                }}
              >
                <span>{stopName}</span>
                {stopLines.length > 0 && (
                  <StopLines
                    className={styles.StopLines}
                    list={[...stopLines]}
                    size="small"
                  />
                )}
              </li>
            );
          })}
        </ul>
      </Main>
    </Fragment>
  );
}

export default RouteLineView;

import React from "react";
import { Fragment, useCallback, useEffect, useState, useEffectEvent } from "react";
import type { EstimationTuple } from "../../types/estimations";
import type { LineViewData, RouteViewData } from "../../interfaces/view";
import { useView } from "../../contexts/ViewContext";
import { getLineBackgroundColor } from "../../utils/LineUtils";
import {
  trackLineEstimations,
  trackRefresh,
} from "../../utils/TelemetryUtils";

import { VIEW_ID_ROUTE_LINE } from "../../constants/ViewConstants";

import {
  API_HOST,
  API_ESTIMATIONS_GET_COMPACT_PATH,
} from "../../utils/ApiConstants";

import Nav from "../../components/Nav";
import Main from "../../components/Main";
import Spinner from "../../components/Spinner";
import ErrorDisplay from "../../components/Error";
import Button from "../../components/Button";
import EstimationsList from "../../components/estimations/EstimationsList";
import styles from "./EstimationsLineView.module.css";
import { useI18n } from "../../contexts/I18nContext";

type CompactLineEstimationsResponse = [
  estimations: EstimationTuple[],
  stops: string[],
];

function EstimationsLineView(): React.JSX.Element {
  const { getText } = useI18n();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { data, setViewIdWithData } = useView();
  // Router guarantees this view only renders when viewId === VIEW_ID_ESTIMATIONS_LINE
  const { stopId, stopName, lineLabel, lineDestination } =
    data as LineViewData;

  const [estimations, setEstimations] = useState<EstimationTuple[]>([]);
  const [stops, setStops] = useState<string[]>([]);
  const backgroundColor = getLineBackgroundColor(lineLabel, "string", true);

  const getEstimations = useCallback(
    (update = false): void => {
      if (update) {
        trackRefresh("line_estimations", false);
      }

      fetch(API_HOST + API_ESTIMATIONS_GET_COMPACT_PATH, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stopId,
          lineLabel,
          refresh: update,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json() as Promise<CompactLineEstimationsResponse>;
        })
        .then((responseData) => {
          const estimationsList = responseData[0];

          if (estimationsList.length === 0) {
            throw new Error("Empty response");
          }

          setEstimations(estimationsList);

          if (!update) {
            setStops(responseData[1]);
          }
        })
        .catch((err: unknown) => {
          console.error(err);
          setError(true);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [stopId, lineLabel]
  );

  const refreshContent = useCallback((): void => {
    setLoading(true);
    setError(false);
    setEstimations([]);
    getEstimations(true);
  }, [getEstimations]);

  const loadLineRouteView = (): void => {
    const routeData: RouteViewData = {
      stopId,
      lineLabel,
      lineDestination,
    };
    setViewIdWithData(VIEW_ID_ROUTE_LINE, routeData);
  };

  const onVisibilityChange = useEffectEvent((): void => {
    if (document.visibilityState === "visible") {
      trackRefresh("line_estimations", true);
      refreshContent();
    }
  });

  useEffect(() => {
    trackLineEstimations(lineLabel, lineDestination);

    getEstimations();

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [getEstimations, lineLabel, lineDestination]);

  return (
    <Fragment>
      <Nav isHeader={false} titleText={stopName} />
      <Main paddingTop="64px" paddingBottom="120px">
        {loading && <Spinner />}
        {error && (
          <ErrorDisplay
            errorText={getText("no_available")}
            retryText={getText("try_again")}
            retryAction={refreshContent}
          />
        )}
        <EstimationsList
          estimations={estimations}
          stops={stops}
          lineAction={refreshContent}
        />
        {!loading && !error && (
          <div className={styles.ContextActions}>
            <Button
              className={styles.ContextButton}
              color={backgroundColor}
              onClick={loadLineRouteView}
            >
              {getText("view_route")}
            </Button>
            <Button
              className={styles.ContextButton}
              color={backgroundColor}
              onClick={refreshContent}
            >
              {getText("refresh")}
            </Button>
          </div>
        )}
      </Main>
    </Fragment>
  );
}

export default EstimationsLineView;

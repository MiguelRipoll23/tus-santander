import React from "react";
import { Fragment, useCallback, useEffect, useState } from "react";
import type { EstimationTuple } from "../../types/estimations";
import type { StopViewData, LineViewData } from "../../interfaces/view";
import { useView } from "../../contexts/ViewContext";
import { getFavorite, toggleFavorite } from "../../utils/FavoriteUtils";
import {
  trackStopEstimations,
  trackRefresh,
  trackFavoriteToggle,
} from "../../utils/TelemetryUtils";

import { VIEW_ID_ESTIMATIONS_LINE } from "../../constants/ViewConstants";

import {
  API_HOST,
  API_ESTIMATIONS_GET_COMPACT_PATH,
} from "../../utils/ApiConstants";

import Nav from "../../components/Nav";
import RefreshIcon from "../../components/RefreshIcon";
import HeartIcon from "../../components/HeartIcon";
import Main from "../../components/Main";
import Spinner from "../../components/Spinner";
import ErrorDisplay from "../../components/Error";
import StopLines from "../../components/StopLines";
import { useI18n } from "../../contexts/I18nContext";
import EstimationsList from "../../components/estimations/EstimationsList";

type CompactEstimationsResponse = [
  estimations: EstimationTuple[],
  lines: string[],
];

function EstimationsStopView(): React.JSX.Element {
  const { getText } = useI18n();
  const { data, setViewIdWithData } = useView();
  // Router guarantees this view only renders when viewId === VIEW_ID_ESTIMATIONS_STOP
  const { stopId, stopName } = data as StopViewData;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [refreshVisible, setRefreshVisible] = useState(false);
  const [heartState, setHeartState] = useState(0);

  const [lines, setLines] = useState<string[]>([]);
  const [estimations, setEstimations] = useState<EstimationTuple[]>([]);

  const getEstimations = useCallback(
    (update = false): void => {
      if (update) {
        trackRefresh("stop_estimations", false);
      }

      fetch(API_HOST + API_ESTIMATIONS_GET_COMPACT_PATH, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stopId,
          refresh: update,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json() as Promise<CompactEstimationsResponse>;
        })
        .then((responseData) => {
          const estimationsList = responseData[0];

          if (estimationsList.length === 0) {
            throw new Error("Empty response");
          }

          setEstimations(estimationsList);

          if (!update) {
            setLines(responseData[1]);
          }

          setRefreshVisible(true);
        })
        .catch((err: unknown) => {
          console.error(err);
          setError(true);
        })
        .finally(() => {
          const newHeartState = getFavorite(stopId) === null ? 1 : 2;
          setLoading(false);
          setHeartState(newHeartState);
        });
    },
    [stopId]
  );

  const refreshContent = useCallback(
    (update: boolean): void => {
      setRefreshVisible(false);
      setLoading(true);
      setError(false);
      setEstimations([]);
      getEstimations(update);
    },
    [getEstimations]
  );

  const syncFavoriteState = (): void => {
    const wasFavorited = getFavorite(stopId) !== null;
    const newHeartState = toggleFavorite(stopId, stopName) ? 2 : 1;
    setHeartState(newHeartState);
    trackFavoriteToggle(stopId, !wasFavorited);
  };

  const updateFavorite = (): void => {
    const favorited = getFavorite(stopId);

    if (favorited) {
      const userConfirms = globalThis.confirm(
        getText("confirm_remove_favorite")
      );

      if (userConfirms) {
        syncFavoriteState();
      }
    } else {
      syncFavoriteState();
    }
  };

  const loadEstimationsLineView = (result: EstimationTuple): void => {
    const lineViewData: LineViewData = {
      stopId,
      stopName,
      lineLabel: result[0],
      lineDestination: result[1],
    };
    setViewIdWithData(VIEW_ID_ESTIMATIONS_LINE, lineViewData);
  };

  useEffect(() => {
    trackStopEstimations(stopId, stopName);

    getEstimations();

    const handleVisibilityChange = (): void => {
      if (document.visibilityState === "visible") {
        trackRefresh("stop_estimations", true);
        refreshContent(true);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [getEstimations, refreshContent, stopId, stopName]);

  return (
    <Fragment>
      <Nav isHeader={false} titleText={stopName}>
        {heartState > 0 && (
          <HeartIcon heartState={heartState} updateFavorite={updateFavorite} />
        )}
      </Nav>
      <Main paddingTop="64px" paddingBottom="105px">
        {loading && <Spinner />}
        {error && (
          <ErrorDisplay
            errorText={getText("no_available")}
            retryText={getText("try_again")}
            retryAction={() => refreshContent(false)}
          />
        )}
        {lines.length > 0 && (
          <StopLines list={lines} estimations={estimations} />
        )}
        <EstimationsList
          estimations={estimations}
          lineAction={loadEstimationsLineView}
        />
        {refreshVisible && (
          <RefreshIcon refreshContent={() => refreshContent(true)} />
        )}
      </Main>
    </Fragment>
  );
}

export default EstimationsStopView;

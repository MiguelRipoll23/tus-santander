import React from "react";
import { Fragment, useCallback, useEffect, useReducer, useEffectEvent } from "react";
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

interface EstimationsStopState {
  loading: boolean;
  error: boolean;
  refreshVisible: boolean;
  heartState: number;
  lines: string[];
  estimations: EstimationTuple[];
}

type EstimationsStopAction =
  | { type: "FETCH_SUCCESS"; estimations: EstimationTuple[]; lines?: string[]; heartState: number }
  | { type: "FETCH_ERROR" }
  | { type: "REFRESH_START" }
  | { type: "SET_HEART"; heartState: number };

const initialState: EstimationsStopState = {
  loading: true,
  error: false,
  refreshVisible: false,
  heartState: 0,
  lines: [],
  estimations: [],
};

function estimationsStopReducer(
  state: EstimationsStopState,
  action: EstimationsStopAction
): EstimationsStopState {
  switch (action.type) {
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        error: false,
        refreshVisible: true,
        heartState: action.heartState,
        estimations: action.estimations,
        ...(action.lines !== undefined ? { lines: action.lines } : {}),
      };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: true };
    case "REFRESH_START":
      return { ...state, loading: true, error: false, refreshVisible: false, estimations: [] };
    case "SET_HEART":
      return { ...state, heartState: action.heartState };
  }
}

function EstimationsStopView(): React.JSX.Element {
  const { getText } = useI18n();
  const { data, setViewIdWithData } = useView();
  const { stopId, stopName } = data as StopViewData;

  const [state, dispatch] = useReducer(estimationsStopReducer, initialState);

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

          dispatch({
            type: "FETCH_SUCCESS",
            estimations: estimationsList,
            ...(!update ? { lines: responseData[1] } : {}),
            heartState: getFavorite(stopId) === null ? 1 : 2,
          });
        })
        .catch((err: unknown) => {
          console.error(err);
          dispatch({ type: "FETCH_ERROR" });
        });
    },
    [stopId]
  );

  const refreshContent = useCallback(
    (update: boolean): void => {
      dispatch({ type: "REFRESH_START" });
      getEstimations(update);
    },
    [getEstimations]
  );

  const syncFavoriteState = (): void => {
    const wasFavorited = getFavorite(stopId) !== null;
    const newHeartState = toggleFavorite(stopId, stopName) ? 2 : 1;
    dispatch({ type: "SET_HEART", heartState: newHeartState });
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

  const onVisibilityChange = useEffectEvent((): void => {
    if (document.visibilityState === "visible") {
      trackRefresh("stop_estimations", true);
      refreshContent(true);
    }
  });

  useEffect(() => {
    trackStopEstimations(stopId, stopName);

    getEstimations();

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [getEstimations, stopId, stopName]);

  return (
    <Fragment>
      <Nav isHeader={false} titleText={stopName}>
        {state.heartState > 0 && (
          <HeartIcon heartState={state.heartState} updateFavorite={updateFavorite} />
        )}
      </Nav>
      <Main paddingTop="64px" paddingBottom="105px">
        {state.loading && <Spinner />}
        {state.error && (
          <ErrorDisplay
            errorText={getText("no_available")}
            retryText={getText("try_again")}
            retryAction={() => refreshContent(false)}
          />
        )}
        {state.lines.length > 0 && (
          <StopLines list={state.lines} estimations={state.estimations} />
        )}
        <EstimationsList
          estimations={state.estimations}
          lineAction={loadEstimationsLineView}
        />
        {state.refreshVisible && (
          <RefreshIcon refreshContent={() => refreshContent(true)} />
        )}
      </Main>
    </Fragment>
  );
}

export default EstimationsStopView;

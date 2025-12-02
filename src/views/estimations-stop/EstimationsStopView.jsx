import { Fragment, useCallback, useEffect, useState } from "react";
import { useView } from "../../contexts/ViewContext.jsx";
import { getFavorite, toggleFavorite } from "../../utils/FavoriteUtils.jsx";
import {
  trackStopEstimations,
  trackRefresh,
  trackFavoriteToggle,
} from "../../utils/TelemetryUtils.jsx";

import { VIEW_ID_ESTIMATIONS_LINE } from "../../constants/ViewConstants.jsx";

import {
  API_HOST,
  API_ESTIMATIONS_GET_COMPACT_PATH,
} from "../../utils/ApiConstants.jsx";

import Nav from "../../components/Nav.jsx";
import RefreshIcon from "../../components/RefreshIcon.jsx";
import HeartIcon from "../../components/HeartIcon.jsx";
import Main from "../../components/Main.jsx";
import Spinner from "../../components/Spinner.jsx";
import Error from "../../components/Error.jsx";
import StopLines from "../../components/StopLines.jsx";
import { useI18n } from "../../contexts/I18nContext.jsx";
import EstimationsList from "../../components/estimations/EstimationsList.jsx";

const EstimationsStopView = () => {
  const { getText } = useI18n();
  const { data, setViewIdWithData } = useView();
  const { stopId, stopName } = data;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [refreshVisible, setRefreshVisible] = useState(false);
  const [heartState, setHeartState] = useState(0);

  const [lines, setLines] = useState([]);
  const [estimations, setEstimations] = useState([]);

  const getEstimations = useCallback(
    (update = false) => {
      try {
        // Reset
        setError(false);
        setEstimations([]);

        // Track refresh events
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
            if (response.ok === false) {
              throw new Error("Network response was not ok");
            }

            return response.json();
          })
          .then((data) => {
            const estimationsList = data[0];

            // Check if response is empty
            if (estimationsList.length === 0) {
              throw new Error("Empty response");
            }

            setEstimations(estimationsList);

            if (update === false) {
              const linesList = data[1];
              setLines(linesList);
            }

            setRefreshVisible(true);
          })
          .catch((error) => {
            console.error(error);
            setError(true);
          })
          .finally(() => {
            const heartState = getFavorite(stopId) === null ? 1 : 2;

            setLoading(false);
            setHeartState(heartState);
          });
      } catch (error) {
        console.error(error);
        setError(true);
        setLoading(false);
      }
    },
    [stopId]
  );

  // Refresh
  const refreshContent = useCallback(
    (update) => {
      setRefreshVisible(false);
      setLoading(true);
      getEstimations(update);
    },
    [getEstimations]
  );

  // Heart
  const updateFavorite = () => {
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

  const syncFavoriteState = () => {
    const wasFavorited = getFavorite(stopId) !== null;
    const heartState = toggleFavorite(stopId, stopName) ? 2 : 1;
    setHeartState(heartState);

    // Track favorite toggle
    trackFavoriteToggle(stopId, !wasFavorited);
  };

  // Line
  const loadEstimationsLineView = (result) => {
    setViewIdWithData(VIEW_ID_ESTIMATIONS_LINE, {
      stopId,
      stopName,
      lineLabel: result[0],
      lineDestination: result[1],
    });
  };

  // Mount
  useEffect(() => {
    // Track page view
    trackStopEstimations(stopId, stopName);

    getEstimations();

    // Auto-refresh
    const handleVisibilityChange = () => {
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
          <Error
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
};

export default EstimationsStopView;

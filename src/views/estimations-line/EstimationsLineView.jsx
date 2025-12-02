import { Fragment, useCallback, useEffect, useState } from "react";
import { useView } from "../../contexts/ViewContext.jsx";
import { getLineBackgroundColor } from "../../utils/LineUtils.jsx";
import {
  trackLineEstimations,
  trackRefresh,
} from "../../utils/TelemetryUtils.jsx";

import { VIEW_ID_ROUTE_LINE } from "../../constants/ViewConstants.jsx";

import {
  API_HOST,
  API_ESTIMATIONS_GET_COMPACT_PATH,
} from "../../utils/ApiConstants.jsx";

import Nav from "../../components/Nav.jsx";
import Main from "../../components/Main.jsx";
import Spinner from "../../components/Spinner.jsx";
import Error from "../../components/Error.jsx";
import Button from "../../components/Button.jsx";
import EstimationsList from "../../components/estimations/EstimationsList.jsx";
import styles from "./EstimationsLineView.module.css";
import { useI18n } from "../../contexts/I18nContext.jsx";

const EstimationsLineView = () => {
  const { getText } = useI18n();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { data, setViewIdWithData } = useView();
  const { stopId, stopName, lineLabel, lineDestination } = data;

  const [estimations, setEstimations] = useState([]);
  const [stops, setStops] = useState([]);
  const backgroundColor = getLineBackgroundColor(lineLabel, "string", true);

  const getEstimations = useCallback(
    (update = false) => {
      try {
        // Reset
        setError(false);
        setEstimations([]);

        // Track refresh events
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
              const stopsList = data[1];
              setStops(stopsList);
            }
          })
          .catch((error) => {
            console.error(error);
            setError(true);
          })
          .finally(() => {
            setLoading(false);
          });
      } catch (error) {
        console.error(error);
        setError(true);
        setLoading(false);
      }
    },
    [stopId, lineLabel, lineDestination]
  );

  // Refresh
  const refreshContent = useCallback(() => {
    setLoading(true);
    getEstimations(true);
  }, [getEstimations]);

  // Route
  const loadLineRouteView = () => {
    setViewIdWithData(VIEW_ID_ROUTE_LINE, {
      stopId,
      lineLabel,
      lineDestination,
    });
  };

  // Mount
  useEffect(() => {
    // Track page view
    trackLineEstimations(lineLabel, lineDestination);

    getEstimations();

    // Auto-refresh
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        trackRefresh("line_estimations", true);
        refreshContent();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [getEstimations, refreshContent, lineLabel, lineDestination]);

  return (
    <Fragment>
      <Nav isHeader={false} titleText={stopName} />
      <Main paddingTop="64px">
        {loading && <Spinner />}
        {error && (
          <Error
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
        {loading === false && error === false && (
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
};

export default EstimationsLineView;

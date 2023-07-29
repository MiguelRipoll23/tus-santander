import { Fragment, useState, useEffect, useCallback } from "react";

import { useView } from "../../contexts/ViewContext.js";
import { getFavorite, toggleFavorite } from "../../utils/FavoriteUtils.js";

import * as ViewConstants from "../../constants/ViewConstants.js";

import ApiUtils from "../../utils/ApiUtils.js";

import Nav from "../../components/Nav.js";
import RefreshIcon from "../../components/RefreshIcon.js";
import HeartIcon from "../../components/HeartIcon.js";
import Content from "../../components/Content.js";
import Spinner from "../../components/Spinner.js";
import Error from "../../components/Error.js";
import StopLines from "../../components/StopLines.js";
import EstimationsList from "../../components/estimations/EstimationsList.js";

const EstimationsStopView = (props) => {
  const { data, setViewIdWithData } = useView();
  const { stopId, stopName } = data;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [refreshVisible, setRefreshVisible] = useState(false);
  const [heartState, setHeartState] = useState(0);

  const [lines, setLines] = useState([]);
  const [estimations, setEstimations] = useState([]);

  const getEstimations = useCallback(
    async (update = false) => {
      // Reset
      setError(false);
      setEstimations([]);

      let query = `?stopId=${stopId}`;

      if (update) {
        query += "&update=true";
      }

      fetch(ApiUtils.API_HOST + ApiUtils.API_PATH_JSON_ESTIMATIONS + query)
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
        })
        .catch((error) => {
          console.error(error);
          setError(true);
        })
        .finally(() => {
          setLoading(false);
          setRefreshVisible(true);

          const heartState = getFavorite(stopId) === null ? 1 : 2;
          setHeartState(heartState);
        });
    },
    [stopId]
  );

  // Refresh
  const refreshContent = useCallback(() => {
    setRefreshVisible(false);
    setLoading(true);
    getEstimations(true);
  }, [getEstimations]);

  // Heart
  const updateFavorite = () => {
    const favorited = getFavorite(stopId);

    if (favorited) {
      const userConfirms = window.confirm(
        "¿Estás seguro de que quieres quitar esta parada de favoritos?"
      );

      if (userConfirms) {
        syncFavoriteState();
      }
    } else {
      syncFavoriteState();
    }
  };

  const syncFavoriteState = () => {
    const heartState = toggleFavorite(stopId, stopName) ? 2 : 1;
    setHeartState(heartState);
  };

  // Line
  const loadEstimationsLineView = (result) => {
    setViewIdWithData(ViewConstants.VIEW_ID_ESTIMATIONS_LINE, {
      stopId,
      stopName,
      lineLabel: result[0],
      lineDestination: result[1],
    });
  };

  // Mount
  useEffect(() => {
    getEstimations();

    // Auto-refresh
    document.onvisibilitychange = () => {
      if (document.visibilityState === "visible") {
        refreshContent();
      }
    };

    return () => {
      document.onvisibilitychange = null;
    };
  }, [getEstimations, refreshContent]);

  return (
    <Fragment>
      <Nav isHeader={false} titleText={stopName}>
        {refreshVisible && (
          <RefreshIcon refreshContent={refreshContent}></RefreshIcon>
        )}
        {heartState > 0 && (
          <HeartIcon heartState={heartState} updateFavorite={updateFavorite} />
        )}
      </Nav>
      <Content>
        {loading && <Spinner />}
        {error && (
          <Error
            errorText="No disponible"
            retryText="Volver a intentar"
            retryAction={refreshContent}
          />
        )}
        {lines.length > 0 && (
          <StopLines list={lines} estimations={estimations} />
        )}
        <EstimationsList
          estimations={estimations}
          lineAction={loadEstimationsLineView}
        />
      </Content>
    </Fragment>
  );
};

export default EstimationsStopView;

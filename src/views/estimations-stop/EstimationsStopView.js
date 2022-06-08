import { Fragment, useState, useEffect, useCallback } from "react";

import { useView } from "../../contexts/ViewContext.js";
import { getColors } from "../../utils/LineUtils.js";
import { getFavorite, toggleFavorite } from "../../utils/FavoriteUtils.js";

import * as ViewConstants from "../../constants/ViewConstants.js";

import ApiUtils from "../../utils/ApiUtils.js";

import Nav from "../../components/Nav.js";
import Content from "../../components/Content.js";
import Spinner from "../../components/Spinner.js";
import Error from "../../components/Error.js";
import StopLines from "../../components/StopLines.js";

import EstimationsCard from "../../components/estimations/EstimationsCard.js";
import EstimationsHeader from "../../components/estimations/EstimationsHeader.js";
import EstimationsBody from "../../components/estimations/EstimationsBody.js";

const EstimationsStopView = (props) => {
  const { data, setViewIdWithData } = useView();
  const { stopId, stopName } = data;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [refreshVisible, setRefreshVisible] = useState(false);
  const [heartState, setHeartState] = useState(0);

  const [lines, setLines] = useState([]);
  const [estimations, setEstimations] = useState([]);

  const getEstimations = useCallback(async () => {
    // Reset
    setError(false);
    setEstimations([]);

    const query = `?stopId=${stopId}`;

    fetch(ApiUtils.API_HOST + ApiUtils.API_PATH_JSON_ESTIMATIONS + query)
      .then((response) => {
        if (response.ok === false) {
          throw new Error("Network response was not ok");
        }

        return response.json();
      })
      .then((data) => {
        const estimationsList = data[0];
        const linesList = data[1];

        // Check if response is empty
        if (estimationsList.length === 0) {
          throw new Error("Empty response");
        }

        setLines(linesList);
        setEstimations(estimationsList);
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
  }, [stopId]);

  // Refresh
  const refreshContent = () => {
    setLoading(true);
    getEstimations();
  };

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
        getEstimations();
      }
    };

    return () => {
      document.onvisibilitychange = null;
    };
  }, [getEstimations]);

  return (
    <Fragment>
      <Nav
        isHeader={false}
        isRefreshVisible={refreshVisible}
        titleText={stopName}
        heartState={heartState}
        refreshContent={refreshContent}
        toggleFavorite={updateFavorite}
      />
      <Content>
        {loading && <Spinner />}
        {error && (
          <Error
            error_text="No disponible"
            retry_text="Volver a intentar"
            retry_action={refreshContent}
          />
        )}
        {lines.length > 0 && <StopLines list={lines} />}
        {estimations.map((result, i) => {
          return (
            <EstimationsCard
              key={i}
              colors={getColors(result[0])}
              onClick={() => loadEstimationsLineView(result)}
            >
              <EstimationsHeader label={result[0]} destination={result[1]} />
              <EstimationsBody time1={result[2]} time2={result[3]} />
            </EstimationsCard>
          );
        })}
      </Content>
    </Fragment>
  );
};

export default EstimationsStopView;

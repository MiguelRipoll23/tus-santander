import { Fragment, useState, useEffect } from "react";
import ApiUtils from "../../utils/ApiUtils.js";
import { getColors } from "../../utils/LineUtils.js";
import { getFavorite, toggleFavorite } from "../../utils/FavoriteUtils.js";

import Spinner from "../../components/Spinner.js";
import Error from "../../components/Error.js";
import StopLines from "../../components/StopLines.js";

import EstimationsCard from "../../components/estimations/EstimationsCard.js";
import EstimationsHeader from "../../components/estimations/EstimationsHeader.js";
import EstimationsBody from "../../components/estimations/EstimationsBody.js";

const EstimationsStopView = (props) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lines, setLines] = useState([]);
  const [estimations, setEstimations] = useState([]);

  const getEstimations = () => {
    const stopId = props.view.data.id;

    // Reset
    if (error) {
      setError(false);
    }

    if (estimations.length > 0) {
      setEstimations([]);
    }

    const query = `?stop_id=${stopId}`;

    fetch(ApiUtils.HOST + ApiUtils.PATH_JSON_ESTIMATIONS + query)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }

        return response.json();
      })
      .then((data) => {
        props.setView({
          nav: {
            title: props.view.data.name,
            refresh: true,
            heart: getFavorite(stopId) === null ? 1 : 2,
          },
        });

        const linesList = data[0];
        const estimationsList = data[1];

        // Check if response is empty
        if (estimationsList.length === 0) {
          throw new Error("Empty response.");
        }

        setLoading(false);
        setLines(linesList);
        setEstimations(estimationsList);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        setError(true);
      });
  };

  // Refresh
  const refresh = () => {
    props.setView({
      nav: {
        refresh: false,
      },
      data: {
        push: false,
        refresh: 0,
        heart: 0,
      },
    });

    setLoading(true);
    getEstimations();
  };

  useEffect(() => {
    if (loading) {
      return;
    }

    if (
      props.view.data?.refresh === undefined ||
      props.view.data?.refresh === 0
    ) {
      return;
    }

    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.view.data.refresh]);

  // Heart
  const updateHeart = () => {
    const result = toggleFavorite(props.view.data.id, props.view.data.name)
      ? 2
      : 1;

    props.setView({
      nav: {
        heart: result,
      },
    });
  };

  useEffect(() => {
    if (props.view.data?.heart === undefined || props.view.data?.heart === 0) {
      return;
    }

    // Confirm
    const favorited = getFavorite(props.view.data.id);

    if (favorited) {
      const result = window.confirm(
        "¿Estás seguro de que quieres quitar esta parada de favoritos?"
      );

      if (result === true) {
        updateHeart();
      }
    } else {
      updateHeart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.view.data.heart]);

  // Line
  const loadEstimationsLineView = (result) => {
    props.setView({
      id: "estimations_line",
      nav: {
        title: props.view.data.name,
        refresh: false,
        heart: false,
      },
      data: {
        push: true,
        id: props.view.data.id,
        name: props.view.data.name,
        line: result[0],
        destination: result[1],
      },
    });
  };

  // Init
  useEffect(() => {
    if (loading === false) {
      return;
    }

    // History
    if (props.view.data.push) {
      window.history.pushState(
        props.view,
        `${props.view.data.name} - TUS Santander`,
        `/parada/${props.view.data.id}`
      );
    }

    // Update navigation bar
    props.setView({
      nav: {
        title: props.view.data.name,
        header: false,
        heart: getFavorite(props.view.data.id) === null ? 1 : 2,
        refresh: false,
      },
      data: {
        refresh: 0,
      },
    });

    // Data
    getEstimations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      {loading && <Spinner />}
      {error && (
        <Error
          error_text="No disponible"
          retry_text="Volver a intentar"
          retry_action={refresh}
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
    </Fragment>
  );
};

export default EstimationsStopView;

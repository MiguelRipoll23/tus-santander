import { Fragment, useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import ApiUtils from "../../utils/ApiUtils.js";

import Spinner from "../../components/Spinner.js";
import Error from "../../components/Error.js";
import StopLines from "../../components/StopLines.js";

const RouteLineViewStyled = styled.ul`
  list-style: none;
  padding-left: 45px;
  margin-top: 14px;
  margin-bottom: 28px;
`;

const StopStyled = styled.li`
  line-height: 20px;
  position: relative;
  padding-bottom: 12px;
  font-size: 18px;
  font-weight: bold;
  animation: fade-in 0.2s;

  & span {
    max-width: 200px;
  }

  &:before {
    content: "";
    position: absolute;
    left: -22.8px;
    border-left: 3px solid ${(props) => props.color};
    width: 1px;
    height: 100%;
  }

  &:after {
    content: "";
    position: absolute;
    left: -31px;
    top: 0px;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    border: 3px solid ${(props) => props.color};
    background: ${(props) => (props.active ? props.color : "#fff")};
  }

  @media (prefers-color-scheme: dark) {
    &:after {
      background: ${(props) => (props.active ? props.color : "#000")};
    }
  }

  &:last-child {
    padding-bottom: 0;
  }

  &:last-child:before {
    display: none;
  }
`;

const RouteLineView = (props) => {
  const { view } = props;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [results, setResults] = useState([]);

  const stopId = props.view.data.id;
  const line = props.view.data.line;
  const destination = props.view.data.destination;

  const query = `?line=${line}&destination=${destination}&stop_id=${stopId}`;

  const getResults = useCallback(() => {
    // Reset
    if (error) {
      setError(false);
    }

    if (results.length > 0) {
      setResults([]);
    }

    fetch(ApiUtils.HOST + ApiUtils.API_PATH_JSON_ROUTE + query)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }

        return response.json();
      })
      .then((data) => {
        // Check if response is empty
        if (data.length === 0) {
          throw new Error("Empty response.");
        }

        setLoading(false);
        setResults(data);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        setError(true);
      });
  }, [error, query, results.length]);

  // Active
  const isActive = (stopId) => {
    if (stopId === props.view.data.id) {
      return true;
    }

    return false;
  };

  // Refresh
  const refresh = () => {
    setLoading(true);
    getResults();
  };

  // Init
  useEffect(() => {
    if (loading === false) {
      return;
    }

    // History
    if (view.data.push) {
      window.history.pushState(
        view,
        `${view.data.name}: ${
          view.data.line
        } ${view.data.destination.toUpperCase()}`,
        `/parada/${view.data.id}/linea/${view.data.line}/${view.data.destination}/ruta`
      );
    }

    // Data
    getResults();
  }, [loading, view, getResults]);

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
      <RouteLineViewStyled>
        {results.map((result, i) => {
          return (
            <StopStyled
              key={i}
              color={props.view.data.color}
              active={isActive(result[0])}
            >
              <span>{result[1]}</span>
              {result[2].length > 0 && (
                <StopLines list={result[2]} size="small" />
              )}
            </StopStyled>
          );
        })}
      </RouteLineViewStyled>
    </Fragment>
  );
};

export default RouteLineView;

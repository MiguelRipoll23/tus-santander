import { Fragment, useState, useCallback, useEffect } from "react";
import styled from "styled-components";

import { useView } from "../../contexts/ViewContext.js";
import { getLineBackgroundColor } from "../../utils/LineUtils.js";
import { API_HOST, API_PATH_JSON_ROUTE } from "../../utils/ApiConstants.js";

import Content from "../../components/Content.js";
import Nav from "../../components/Nav.js";
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
    background: ${(props) => (props.$active ? props.color : "#fff")};
  }

  @media (prefers-color-scheme: dark) {
    &:after {
      background: ${(props) => (props.$active ? props.color : "#000")};
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
  const { data } = useView();
  const { stopId, lineLabel, lineDestination } = data;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [routes, setRoutes] = useState([]);

  const color = getLineBackgroundColor(lineLabel, "string");

  const getStops = useCallback(() => {
    // Reset
    setError(false);
    setRoutes([]);

    const query = `?stopId=${stopId}&lineLabel=${lineLabel}&lineDestination=${lineDestination}`;

    fetch(API_HOST + API_PATH_JSON_ROUTE + query)
      .then((response) => {
        if (response.ok === false) {
          throw new Error("Network response was not ok");
        }

        return response.json();
      })
      .then((data) => {
        // Check if response is empty
        if (data.length === 0) {
          throw new Error("Empty response");
        }

        setRoutes(data);
      })
      .catch((error) => {
        console.error(error);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [stopId, lineLabel, lineDestination]);

  // Check if current stop
  const isActive = (itemStopId) => {
    if (itemStopId === stopId) {
      return true;
    }

    return false;
  };

  // Scroll
  useEffect(() => {
    document
      .querySelector("#stop-active")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [routes]);

  // Refresh
  const refreshContent = () => {
    setLoading(true);
    getStops();
  };

  // Mount
  useEffect(() => {
    getStops();
  }, [getStops]);

  return (
    <Fragment>
      <Nav
        isHeader={false}
        titleText={`${lineLabel} ${lineDestination.toUpperCase()}`}
      />
      <Content>
        {loading && <Spinner />}
        {error && (
          <Error
            errorText="No disponible"
            retryText="Volver a intentar"
            retryAction={refreshContent}
          />
        )}
        <RouteLineViewStyled>
          {routes.map((item, i) => {
            const [stopId, stopName, stopLines] = item;

            return (
              <StopStyled
                key={i}
                color={color}
                $active={isActive(stopId)}
                {...(isActive(stopId) && { id: "stop-active" })}
              >
                <span>{stopName}</span>
                {stopLines.length > 0 && (
                  <StopLines list={stopLines} size="small" />
                )}
              </StopStyled>
            );
          })}
        </RouteLineViewStyled>
      </Content>
    </Fragment>
  );
};

export default RouteLineView;

import { Fragment, useCallback, useEffect, useState } from "react";
import { useView } from "../../contexts/ViewContext.jsx";
import { getLineBackgroundColor } from "../../utils/LineUtils.jsx";
import { trackRouteView } from "../../utils/TelemetryUtils.jsx";
import { API_HOST, API_PATH_JSON_ROUTE } from "../../utils/ApiConstants.jsx";

import Main from "../../components/Main.jsx";
import Nav from "../../components/Nav.jsx";
import Spinner from "../../components/Spinner.jsx";
import Error from "../../components/Error.jsx";
import StopLines from "../../components/StopLines.jsx";
import { useI18n } from "../../contexts/I18nContext.jsx";

import styles from "./RouteLineView.module.css";

const RouteLineView = () => {
  const { getText } = useI18n();
  const { data } = useView();
  const { stopId, lineLabel, lineDestination } = data;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [routes, setRoutes] = useState([]);

  const color = getLineBackgroundColor(lineLabel, "string");

  const getStops = useCallback(() => {
    setError(false);
    setRoutes([]);

    const query = `?stopId=${stopId}&lineLabel=${lineLabel}&lineDestination=${lineDestination}`;

    fetch(API_HOST + API_PATH_JSON_ROUTE + query)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
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

  const isActive = (itemStopId) => itemStopId === stopId;

  useEffect(() => {
    document
      .querySelector("#stop-active")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [routes]);

  useEffect(() => {
    // Track route view
    trackRouteView(lineLabel, lineDestination);
    
    getStops();
  }, [getStops, lineLabel, lineDestination]);

  const refreshContent = () => {
    setLoading(true);
    getStops();
  };

  return (
    <Fragment>
      <Nav
        isHeader={false}
        titleText={`${lineLabel} ${lineDestination.toUpperCase()}`}
      />
      <Main paddingTop="64px">
        {loading && <Spinner />}
        {error && (
          <Error
            errorText={getText("no_available")}
            retryText={getText("try_again")}
            retryAction={refreshContent}
          />
        )}
        <ul className={styles.routeLineList}>
          {routes.map((item, i) => {
            const [itemStopId, stopName, stopLines] = item;
            const active = isActive(itemStopId);

            return (
              <li
                key={i}
                className={styles.stopItem}
                id={active ? "stop-active" : undefined}
                style={{
                  "--line-color": color,
                  "--active-color": active ? color : "#fff",
                  "--active-color-dark": active ? color : "#000",
                }}
              >
                <span>{stopName}</span>
                {stopLines.length > 0 && (
                  <StopLines
                    className={styles.StopLines}
                    list={stopLines}
                    size="small"
                  />
                )}
              </li>
            );
          })}
        </ul>
      </Main>
    </Fragment>
  );
};

export default RouteLineView;

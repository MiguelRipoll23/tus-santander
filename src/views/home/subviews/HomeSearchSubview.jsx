import { Fragment, useEffect, useState } from "react";

import { useView } from "../../../contexts/ViewContext.jsx";
import { VIEW_ID_ESTIMATIONS_STOP } from "../../../constants/ViewConstants.jsx";
import { sendTelemetryEvent } from "../../../utils/TelemetryUtils.jsx";

import Nav from "../../../components/Nav.jsx";
import Stops from "../../../json/stops.min.json";
import styles from "./HomeSearchSubview.module.css";
import { useI18n } from "../../../contexts/I18nContext.jsx";

const HomeSearchSubview = () => {
  const { getText } = useI18n();
  const { setViewIdWithData } = useView();

  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState([]);

  const updateValue = (event) => {
    setSearchText(event.target.value.toLowerCase());
  };

  // Search results
  useEffect(() => {
    const list = [];

    if (searchText.length > 0) {
      if (isNaN(searchText)) {
        // Search stop name
        for (let stopKey in Stops) {
          const stop = Stops[stopKey];

          let stopName = stop[3];
          stopName = stopName.toLowerCase();

          if (searchText.length < 4) {
            if (stopName.substring(0, searchText.length) !== searchText) {
              continue;
            }
          } else if (stopName.indexOf(searchText) === -1) {
            continue;
          }

          // Add to list
          list.push(stop);

          // Limit results
          if (list.length === 6) {
            break;
          }
        }
      } else if (searchText in Stops) {
        // Search stop id
        list.push(Stops[searchText]);
      }
    }

    setResults(list);
  }, [searchText]);

  const loadEstimationsStopView = (stopId, stopName) => {
    // Track search result selection
    sendTelemetryEvent("search_select", {
      stop_id: stopId,
      search_term: searchText?.substring(0, 20) || "", // Limit search term length
      results_count: results.length,
    });

    setViewIdWithData(VIEW_ID_ESTIMATIONS_STOP, {
      stopId,
      stopName,
    });
  };

  const marginBottom = results.length > 0 ? "0" : "12px";

  return (
    <Fragment>
      <Nav isHeader={true} titleText={getText("search")} />
      <div className={styles.content}>
        <div className={styles.icon} style={{ marginBottom }}>
          <input
            className={styles.input}
            type="text"
            placeholder={getText("search")}
            aria-label={getText("search")}
            inputMode="search"
            autoFocus={true}
            autoComplete="off"
            onInput={updateValue}
          />
        </div>

        {results.length > 0 && (
          <div className={styles.results}>
            {results.map((result, i) => {
              const stopId = result[0];
              const stopName = result[3];

              return (
                <button
                  className={styles.result}
                  key={i}
                  onClick={() => loadEstimationsStopView(stopId, stopName)}
                >
                  {`${stopName} (${stopId})`}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default HomeSearchSubview;

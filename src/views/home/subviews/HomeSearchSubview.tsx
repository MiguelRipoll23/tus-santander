import React from "react";
import type { FormEvent } from "react";
import { Fragment, useMemo, useState } from "react";
import type { StopTuple, StopsData } from "../../../types/stops";

import { useView } from "../../../contexts/ViewContext";
import { VIEW_ID_ESTIMATIONS_STOP } from "../../../constants/ViewConstants";
import { EVENT_TYPE_SEARCH_SELECT } from "../../../constants/TelemetryConstants";
import { sendTelemetryEvent } from "../../../utils/TelemetryUtils";

import Nav from "../../../components/Nav";
import stopsJson from "../../../json/stops.min.json";
import styles from "./HomeSearchSubview.module.css";
import { useI18n } from "../../../contexts/I18nContext";

// Type assertion justified: JSON structure matches StopsData (arrays of [id, lat, lng, name])
const Stops = stopsJson as unknown as StopsData;

function HomeSearchSubview(): React.JSX.Element {
  const { getText } = useI18n();
  const { setViewIdWithData } = useView();

  const [searchText, setSearchText] = useState("");

  const updateValue = (event: FormEvent<HTMLInputElement>): void => {
    setSearchText(event.currentTarget.value.toLowerCase());
  };

  const results = useMemo<StopTuple[]>(() => {
    const list: StopTuple[] = [];

    if (searchText.length > 0) {
      if (isNaN(Number(searchText))) {
        for (const stopKey in Stops) {
          const stop = Stops[stopKey];
          const stopName = stop[3].toLowerCase();

          if (searchText.length < 4) {
            if (stopName.substring(0, searchText.length) !== searchText) {
              continue;
            }
          } else if (!stopName.includes(searchText)) {
            continue;
          }

          list.push(stop);

          if (list.length === 6) {
            break;
          }
        }
      } else if (searchText in Stops) {
        list.push(Stops[searchText]);
      }
    }

    return list;
  }, [searchText]);

  const loadEstimationsStopView = (stopId: number, stopName: string): void => {
    sendTelemetryEvent(EVENT_TYPE_SEARCH_SELECT, {
      stop_id: stopId,
      search_term: searchText.substring(0, 20),
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
      <Nav isHeader titleText={getText("search")} />
      <div className={styles.content}>
        <div className={styles.icon} style={{ marginBottom }}>
          <input
            className={styles.input}
            type="text"
            placeholder={getText("search")}
            aria-label={getText("search")}
            inputMode="search"
            autoFocus
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
                  type="button"
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
}

export default HomeSearchSubview;

import { Fragment, useState, useEffect, useCallback } from "react";
import styled from "styled-components";

import { useView } from "../../contexts/ViewContext.js";
import { getColors, getColor } from "../../utils/LineUtils.js";

import * as ViewConstants from "../../constants/ViewConstants.js";

import ApiUtils from "../../utils/ApiUtils.js";
import StyleUtils from "../../utils/StyleUtils.js";

import Nav from "../../components/Nav.js";
import Content from "../../components/Content.js";
import Spinner from "../../components/Spinner.js";
import Error from "../../components/Error.js";
import Button from "../../components/Button.js";
import EstimationsCard from "../../components/estimations/EstimationsCard.js";
import EstimationsHeader from "../../components/estimations/EstimationsHeader.js";
import EstimationsBody from "../../components/estimations/EstimationsBody.js";
import NextStops from "../../components/estimations/NextStops.js";

const ContextActionsStyled = styled.div`
  margin: 0 ${StyleUtils.MARGIN_LR};
  position: fixed;
  bottom: 50px;
  width: calc(100% - (${StyleUtils.MARGIN_LR} * 2));
  display: flex;
  animation: fade-in 0.2s;
`;

const ButtonStyled = styled(Button)`
  flex: 1;
  display: block;
  margin-right: 20px;
  padding: 14px;

  &:last-child {
    margin-right: 0;
  }
`;

const EstimationsLineView = (props) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { data, setViewIdWithData } = useView();
  const { stopId, stopName, lineLabel, lineDestination } = data;

  const [estimations, setEstimations] = useState([]);
  const [stops, setStops] = useState([]);

  // Colors
  const colors = getColors(lineLabel);
  const color = getColor(lineLabel, "string");

  const getEstimations = useCallback(
    (update = false) => {
      // Reset
      setError(false);
      setEstimations([]);

      let query = `?stopId=${stopId}&lineLabel=${lineLabel}&lineDestination=${lineDestination}`;

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
    },
    [stopId, lineLabel, lineDestination]
  );

  // Refresh
  const refreshContent = () => {
    setLoading(true);
    getEstimations(true);
  };

  // Route
  const loadLineRouteView = () => {
    setViewIdWithData(ViewConstants.VIEW_ID_ROUTE_LINE, {
      stopId,
      lineLabel,
      lineDestination,
      color,
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
  }, [getEstimations]);

  return (
    <Fragment>
      <Nav
        isHeader={false}
        titleText={stopName}
        refreshContent={refreshContent}
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
        {estimations.map((item, i) => {
          const [label, destination, time1, time2] = item;

          return (
            <EstimationsCard key={i} colors={colors} onClick={refreshContent}>
              <EstimationsHeader label={label} destination={destination} />
              <EstimationsBody time1={time1} time2={time2} />
              {estimations.length === 1 && stops.length > 0 && (
                <NextStops list={stops} colors={colors} />
              )}
            </EstimationsCard>
          );
        })}
        {loading === false && error === false && (
          <ContextActionsStyled>
            <ButtonStyled color={color} onClick={loadLineRouteView}>
              Ver recorrido
            </ButtonStyled>
            <ButtonStyled color={color} onClick={refreshContent}>
              Actualizar
            </ButtonStyled>
          </ContextActionsStyled>
        )}
      </Content>
    </Fragment>
  );
};

export default EstimationsLineView;

import { Fragment, useState, useEffect } from 'react';
import styled from 'styled-components';
import { getColors, getColor } from '../../utils/LineUtils.js';
import ApiUtils from '../../utils/ApiUtils.js';
import StyleUtils from '../../utils/StyleUtils.js';

import Spinner from '../../components/Spinner.js';
import Error from '../../components/Error.js';
import Button from '../../components/Button.js';
import EstimationsCard from '../../components/estimations/EstimationsCard.js';
import EstimationsHeader from '../../components/estimations/EstimationsHeader.js';
import EstimationsBody from '../../components/estimations/EstimationsBody.js';
import NextStops from '../../components/estimations/NextStops.js';

const ContextActionsStyled = styled.div`
  margin: 0 ${StyleUtils.MARGIN_LR};
  position: fixed;
  bottom: 50px;
  width: calc(100% - (${StyleUtils.MARGIN_LR} * 2));
  display: flex;
  animation: fade-in .2s;
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
  const [estimations, setEstimations] = useState([]);
  const [stops, setStops] = useState([]);

  const getestimations = () => {
    const stopId = props.view.data.id;
    const line = props.view.data.line;
    const destination = props.view.data.destination;

    // Reset
    if (error) {
      setError(false);
    }

    if (estimations.length > 0) {
      setEstimations([]);
    }

    const query = `?stop_id=${stopId}&line=${line}&destination=${destination}`;

    fetch(ApiUtils.HOST + ApiUtils.PATH_JSON_ESTIMATIONS + query)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }

        return response.json();
      })
      .then(data => {
        const estimationsList = data[0];
        const stopsList = data[1];

        // Check if response is empty
        if (estimationsList.length === 0) {
          throw new Error('Empty response.');
        }

        setLoading(false);
        setEstimations(estimationsList);
        setStops(stopsList)
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
        setError(true);
      });
  };

  // Refresh
  const refresh = () => {
    setLoading(true);
    getestimations();
  };

  useEffect(() => {
    if (loading) {
      return;
    }

    if (props.view.data?.refresh === undefined || props.view.data?.refresh === 0) {
      return;
    }

    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.view.data.refresh]);

  // Route
  const loadLineRoute = () => {
    props.setView({
      id: 'route_line',
      nav: {
        title: `${props.view.data.line} ${props.view.data.destination.toUpperCase()}`,
        header: false
      },
      data: {
        push: true,
        id: props.view.data.id,
        name: props.view.data.name,
        line: props.view.data.line,
        destination: props.view.data.destination,
        color: getColor(props.view.data.line, 'string')
      }
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
        `${props.view.data.name}: ${props.view.data.line} ${props.view.data.destination.toUpperCase()}`,
        `/parada/${props.view.data.id}/linea/${props.view.data.line}/${props.view.data.destination}`
      );
    }

    // Data
    getestimations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      {loading && <Spinner />}
      {error && <Error error_text="No disponible" retry_text="Volver a intentar" retry_action={refresh} />}
      {estimations.map((result, i) => {
        return <EstimationsCard key={i} colors={getColors(props.view.data.line)}>
          <EstimationsHeader label={props.view.data.line} destination={props.view.data.destination} />
          <EstimationsBody time1={result[2]} time2={result[3]} />
          {estimations.length === 1 && stops.length > 0 && <NextStops list={stops} colors={getColors(props.view.data.line)} />}
        </EstimationsCard>
      })}
      {loading === false && error === false && <ContextActionsStyled>
        <ButtonStyled color={getColor(props.view.data.line, 'string')} onClick={loadLineRoute}>Ver recorrido</ButtonStyled>
        <ButtonStyled color={getColor(props.view.data.line, 'string')} onClick={refresh}>Actualizar</ButtonStyled>
      </ContextActionsStyled>}
    </Fragment>
  );
};

export default EstimationsLineView;
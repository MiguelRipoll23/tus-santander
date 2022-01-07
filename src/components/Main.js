import styled from 'styled-components';

import HomeView from '../views/home/HomeView.js';
import MapView from '../views/map/MapView.js';
import EstimationsStopView from '../views/estimations-stop/EstimationsStopView.js';
import EstimationsLineView from '../views/estimations-line/EstimationsLineView.js';
import RouteLineView from '../views/route-line/RouteLineView.js';

const Content = (props) => {
  switch (props.view.id) {
    case 'home':
      return <HomeView view={props.view} setNav={props.setNav} setView={props.setView} />;

    case 'map':
      return <MapView view={props.view} setNav={props.setNav} setView={props.setView} />;

    case 'estimations_stop':
      return <EstimationsStopView view={props.view} setNav={props.setNav} setView={props.setView} />;

    case 'estimations_line':
      return <EstimationsLineView view={props.view} setNav={props.setNav} setView={props.setView} />;

    case 'route_line':
      return <RouteLineView view={props.view} setNav={props.setNav} setView={props.setView} />;

    default:
      return null;
  }
}

const MainStyled = styled.main`
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;

const Main = (props) => {
  return (
    <MainStyled>
      <Content view={props.view} setNav={props.setNav} setView={props.setView} />
    </MainStyled>
  );
};

export default Main;

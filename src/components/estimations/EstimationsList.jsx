import styled from "styled-components";

import EstimationsCard from "../../components/estimations/EstimationsCard.jsx";
import EstimationsHeader from "../../components/estimations/EstimationsHeader.jsx";
import EstimationsBody from "../../components/estimations/EstimationsBody.jsx";
import NextStops from "../../components/estimations/NextStops.jsx";

const EstimationsListStyled = styled.div``;

const EstimationsList = (props) => {
  const items = props.estimations.map((item, i) => {
    const [label, destination, time1, time2] = item;

    return (
      <EstimationsCard
        key={i}
        id={"label-" + label}
        label={label}
        onClick={() => props.lineAction(item)}
      >
        <EstimationsHeader label={label} destination={destination} />
        <EstimationsBody time1={time1} time2={time2} />
        {props.estimations.length === 1 && props.stops?.length > 0 && (
          <NextStops label={label} list={props.stops} />
        )}
      </EstimationsCard>
    );
  });

  return <EstimationsListStyled>{items}</EstimationsListStyled>;
};

export default EstimationsList;

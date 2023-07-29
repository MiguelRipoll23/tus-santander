import styled from "styled-components";

import { getColors } from "../../utils/LineUtils.js";

import EstimationsCard from "../../components/estimations/EstimationsCard.js";
import EstimationsHeader from "../../components/estimations/EstimationsHeader.js";
import EstimationsBody from "../../components/estimations/EstimationsBody.js";
import NextStops from "../../components/estimations/NextStops.js";

const EstimationsListStyled = styled.div``;

const EstimationsList = (props) => {
  const items = props.estimations.map((item, i) => {
    const [label, destination, time1, time2] = item;
    const colors = getColors(label);

    return (
      <EstimationsCard
        key={i}
        id={"label-" + label}
        colors={colors}
        onClick={() => props.lineAction(item)}
      >
        <EstimationsHeader label={label} destination={destination} />
        <EstimationsBody time1={time1} time2={time2} />
        {props.estimations.length === 1 && props.stops?.length > 0 && (
          <NextStops list={props.stops} colors={colors} />
        )}
      </EstimationsCard>
    );
  });

  return <EstimationsListStyled>{items}</EstimationsListStyled>;
};

export default EstimationsList;

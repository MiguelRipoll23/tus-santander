import React from "react";
import type { EstimationTuple } from "../../types/estimations";
import EstimationsCard from "../../components/estimations/EstimationsCard";
import EstimationsHeader from "../../components/estimations/EstimationsHeader";
import EstimationsBody from "../../components/estimations/EstimationsBody";
import NextStops from "../../components/estimations/NextStops";

interface EstimationsListProps {
  estimations: readonly EstimationTuple[];
  lineAction: (item: EstimationTuple) => void;
  stops?: readonly string[];
}

function EstimationsList({
  estimations,
  lineAction,
  stops,
}: EstimationsListProps): React.JSX.Element {
  const items = estimations.map((item, i) => {
    const [label, destination, time1, time2] = item;

    return (
      <EstimationsCard
        key={i}
        id={"label-" + label}
        label={label}
        onClick={() => lineAction(item)}
      >
        <EstimationsHeader label={label} destination={destination} />
        <EstimationsBody time1={time1} time2={time2} />
        {estimations.length === 1 && stops != null && stops.length > 0 && (
          <NextStops label={label} list={stops} />
        )}
      </EstimationsCard>
    );
  });

  return <div className="flex flex-col gap-[10px]">{items}</div>;
}

export default EstimationsList;

import React from "react";

interface EstimationsBodyProps {
  time1: number;
  time2: number;
}

function getTimeText(minutes: number): string {
  if (minutes === 0) return ">>";
  if (minutes > 0) return `${minutes} MIN`;
  return "- -";
}

function EstimationsBody({ time1, time2 }: EstimationsBodyProps): React.JSX.Element {
  return (
    <div className="inline-block rounded-lg leading-5 text-[26px] pb-[22px] px-6 w-full box-border">
      <div className="inline-block w-[120px]" id="time1" data-time={time1}>
        {getTimeText(time1)}
      </div>
      <div className="inline-block opacity-60">{getTimeText(time2)}</div>
    </div>
  );
}

export default EstimationsBody;

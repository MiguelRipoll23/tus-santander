import type React from "react";

interface EstimationsHeaderProps {
  label: string;
  destination: string;
}

function EstimationsHeader({ label, destination }: EstimationsHeaderProps): React.JSX.Element {
  return (
    <div className="pt-[18px] px-6 mb-[30px]">
      <span className="text-[32px] block">{label}</span>
      <span className="text-[22px]">{destination.toUpperCase()}</span>
    </div>
  );
}

export default EstimationsHeader;

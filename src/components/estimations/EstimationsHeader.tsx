import type React from "react";

interface EstimationsHeaderProps {
  label: string;
  destination: string;
}

function EstimationsHeader({ label, destination }: EstimationsHeaderProps): React.JSX.Element {
  return (
    <div className="pt-4.5 px-6 mb-7.5">
      <span className="text-4xl block">{label}</span>
      <span className="text-2xl">
        {destination.toUpperCase()}
      </span>
    </div>
  );
}

export default EstimationsHeader;

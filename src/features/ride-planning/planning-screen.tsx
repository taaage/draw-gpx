import type { ReactNode } from "react";
import { ArrowIcon } from "@/shared/arrow-icon";
import { StepHeader } from "@/shared/step-header";
import { RideSettings } from "./ride-settings";

type PlanningScreenProps = {
  locationPicker: ReactNode;
  distance: number;
  areaKm: number;
  onDistanceChange: (distance: number) => void;
  onAreaChange: (areaKm: number) => void;
  onBack: () => void;
  onFindRoutes: () => void;
  loading: boolean;
  hasPlace: boolean;
  error: string | null;
};

export function PlanningScreen({
  locationPicker, distance, areaKm, onDistanceChange, onAreaChange,
  onBack, onFindRoutes, loading, hasPlace, error,
}: PlanningScreenProps) {
  return (
    <section className="intro-panel next-step distance-step">
      <StepHeader step={2} onBack={onBack} backLabel="Back to shape selection" />
      <div className="distance-content">
        <span className="kicker">Step 2</span>
        <h1 className="step-title">Set your location and ride distance.</h1>
        {locationPicker}
        <RideSettings
          distance={distance} areaKm={areaKm}
          onDistanceChange={onDistanceChange} onAreaChange={onAreaChange}
        />
      </div>
      <button className="find-routes-button" type="button" onClick={onFindRoutes} disabled={loading || !hasPlace}>
        {loading ? "Finding routes…" : "Find routes"}
        <ArrowIcon size={19} />
      </button>
      {error && <p className="route-error" role="alert">{error}</p>}
    </section>
  );
}

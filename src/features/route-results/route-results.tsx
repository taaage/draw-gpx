import type { CyclingRoute } from "@/features/ride-planning/cycling-route";
import { StepHeader } from "@/shared/step-header";
import { RoutePreview } from "./route-preview";

type RouteResultsProps = {
  route: CyclingRoute | null;
  areaKm: number;
  placeName?: string;
  onBack: () => void;
};

export function RouteResults({ route, areaKm, placeName, onBack }: RouteResultsProps) {
  return (
    <section className="intro-panel next-step">
      <StepHeader step={3} onBack={onBack} backLabel="Back to ride distance" />
      <div className="route-results-content">
        <span className="kicker">Your ride</span>
        <h1 className="landing-title">A route<br />to ride.</h1>
        {route && (
          <div className="route-result-card">
            <RoutePreview route={route} />
            <div className="route-result-stats">
              <div><strong>{route.distanceKm.toFixed(1)}</strong><span>km</span></div>
              <div><strong>{route.durationMinutes}</strong><span>min approx.</span></div>
            </div>
            <p className="route-target">Target {route.targetDistanceKm} km · Area {areaKm.toFixed(1)} km</p>
            <p className="route-result-place">{placeName}</p>
          </div>
        )}
        <p className="route-results-note">
          Snapped to mapped bicycle roads and paths. The route follows your shape where the road network allows; actual distance can differ from the target.
        </p>
      </div>
    </section>
  );
}

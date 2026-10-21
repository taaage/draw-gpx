import type { Place } from "@/features/location-search/types";
import type { CyclingRoute } from "@/features/ride-planning/cycling-route";
import type { PlannerScreen } from "@/features/ride-planning/types";
import type { DrawPoint } from "@/features/shapes/types";

export type RideMapProps = {
  screen: PlannerScreen;
  selectedPlace: Place | null;
  shapeOutline: DrawPoint[];
  distance: number;
  areaKm: number;
  cyclingRoute: CyclingRoute | null;
};

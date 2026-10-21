import { useState } from "react";
import type { Place } from "@/features/location-search/types";
import type { DrawPoint } from "@/features/shapes/types";
import { findCyclingRoute, type CyclingRoute } from "./cycling-route";

export function useRouteGeneration() {
  const [route, setRoute] = useState<CyclingRoute | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateRoute = async (
    shapeOutline: DrawPoint[], place: Place | null, distance: number, areaKm: number,
  ) => {
    if (!place || shapeOutline.length < 3) {
      setError("Choose a shape and starting location before finding a route.");
      return false;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await findCyclingRoute(
        shapeOutline, [place.latitude, place.longitude], distance, areaKm,
      );
      setRoute(result);
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not find a bike route. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { route, loading, error, generateRoute, clearRoute: () => setRoute(null) };
}

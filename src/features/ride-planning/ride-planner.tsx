"use client";

import { useState } from "react";
import { LocationPicker } from "@/features/location-search/location-picker";
import type { Place } from "@/features/location-search/types";
import { useLocationSearch } from "@/features/location-search/use-location-search";
import { RideMap } from "@/features/ride-map/ride-map";
import { RouteResults } from "@/features/route-results/route-results";
import { ShapePicker } from "@/features/shapes/shape-picker";
import { useShapeSelection } from "@/features/shapes/use-shape-selection";
import { WelcomeScreen } from "@/features/welcome/welcome-screen";
import { PlanningScreen } from "./planning-screen";
import type { PlannerScreen } from "./types";
import { useRouteGeneration } from "./use-route-generation";

export default function RidePlanner() {
  const [screen, setScreen] = useState<PlannerScreen>("welcome");
  const [distance, setDistance] = useState(5);
  const [area, setArea] = useState(6.5);
  const [locationQuery, setLocationQuery] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const selection = useShapeSelection();
  const locationSearch = useLocationSearch(locationQuery);
  const { route, loading, error, generateRoute, clearRoute } = useRouteGeneration();

  const handleFindRoutes = async () => {
    if (await generateRoute(selection.shapeOutline, selectedPlace, distance, area)) {
      setScreen("routes");
    }
  };

  return (
    <main className={`landing ${screen !== "welcome" ? "step-open" : ""} ${screen === "distance" ? "distance-open" : ""} ${screen === "routes" ? "route-open" : ""}`}>
      <RideMap
        screen={screen}
        selectedPlace={selectedPlace}
        shapeOutline={selection.shapeOutline}
        distance={distance}
        areaKm={area}
        cyclingRoute={route}
      />
      {screen === "welcome" ? (
        <WelcomeScreen onBegin={() => setScreen("shape")} />
      ) : screen === "shape" ? (
        <ShapePicker selection={selection} onBack={() => setScreen("welcome")} onContinue={() => setScreen("distance")} />
      ) : screen === "distance" ? (
        <PlanningScreen
          locationPicker={
            <LocationPicker
              {...locationSearch}
              query={locationQuery}
              selectedPlace={selectedPlace}
              onQueryChange={(query) => {
                setLocationQuery(query);
                setSelectedPlace(null);
                clearRoute();
              }}
              onSelect={(place) => {
                setSelectedPlace(place);
                clearRoute();
              }}
            />
          }
          distance={distance}
          areaKm={area}
          onDistanceChange={(value) => { setDistance(value); clearRoute(); }}
          onAreaChange={(value) => { setArea(value); clearRoute(); }}
          onBack={() => setScreen("shape")}
          onFindRoutes={handleFindRoutes}
          loading={loading}
          hasPlace={selectedPlace !== null}
          error={error}
        />
      ) : (
        <RouteResults route={route} areaKm={area} placeName={selectedPlace?.name} onBack={() => setScreen("distance")} />
      )}
    </main>
  );
}

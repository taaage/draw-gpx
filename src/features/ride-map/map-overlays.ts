import L from "leaflet";
import { buildShapeCoordinates, type Coordinate } from "@/features/ride-planning/cycling-route";
import { EXAMPLE_ROUTE } from "./example-route";
import type { RideMapProps } from "./types";

export function drawMapOverlays(overlays: L.LayerGroup, {
  screen, selectedPlace, shapeOutline, distance, areaKm, cyclingRoute,
}: RideMapProps) {
  overlays.clearLayers();
  if (screen === "welcome" && !cyclingRoute) {
    L.polyline(EXAMPLE_ROUTE, {
      color: "#df694f", weight: 2.5, opacity: 0.9, dashArray: "5 7", lineCap: "round",
    }).addTo(overlays);
    L.polyline(EXAMPLE_ROUTE.slice(0, 14), {
      color: "#211f1c", weight: 4, opacity: 0.96, lineCap: "round", lineJoin: "round",
    }).addTo(overlays);
  }

  if (screen === "routes" && cyclingRoute) {
    const coordinates = cyclingRoute.coordinates;
    L.polyline(coordinates, {
      color: "#fffdfa", weight: 8, opacity: 0.95, lineCap: "round", lineJoin: "round",
    }).addTo(overlays);
    L.polyline(coordinates, {
      color: "#211f1c", weight: 4, opacity: 1, lineCap: "round", lineJoin: "round",
    }).addTo(overlays);
    L.circleMarker(coordinates[0], {
      radius: 6, color: "#fffdfa", weight: 2, fillColor: "#df694f", fillOpacity: 1,
    }).addTo(overlays);
  }

  if (selectedPlace && screen !== "routes") {
    const center: Coordinate = [selectedPlace.latitude, selectedPlace.longitude];
    L.circle(center, {
      radius: areaKm * 1000,
      color: "#211f1c",
      weight: 1,
      opacity: 0.46,
      dashArray: "4 6",
      fillColor: "#f8f6f1",
      fillOpacity: 0.04,
      interactive: false,
    }).addTo(overlays);
    if (shapeOutline.length > 2) {
      try {
        const outline = buildShapeCoordinates(shapeOutline, center, distance, areaKm);
        outline.push(outline[0]);
        L.polyline(outline, {
          color: "#df694f",
          weight: 2,
          opacity: 0.75,
          dashArray: "5 6",
          lineCap: "round",
          lineJoin: "round",
        }).addTo(overlays);
      } catch (error) {
        console.error("Could not draw the selected shape on the map.", error);
      }
    }
    L.circleMarker(center, {
      radius: 6, color: "#fffdfa", weight: 2, fillColor: "#211f1c", fillOpacity: 1,
    }).addTo(overlays);
  }
}

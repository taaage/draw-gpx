import L from "leaflet";
import type { RideMapProps } from "./types";

export function fitRideMap(map: L.Map, element: HTMLDivElement | null, {
  selectedPlace, screen, cyclingRoute, shapeOutline, areaKm,
}: RideMapProps) {
  if (!selectedPlace) return;

  const isMobile = window.innerWidth <= 760;
  const panel = element?.parentElement?.querySelector(".intro-panel");
  const panelHeight = panel?.getBoundingClientRect().height ?? 0;
  const paddingTopLeft: L.PointExpression = isMobile
    ? [24, 24]
    : [Math.min(430, Math.round(window.innerWidth * 0.32)), 36];
  const paddingBottomRight: L.PointExpression = isMobile
    ? [24, Math.round(panelHeight + 24)]
    : [36, 36];

  if (cyclingRoute && screen === "routes") {
    map.fitBounds(L.latLngBounds(cyclingRoute.coordinates), {
      paddingTopLeft, paddingBottomRight, maxZoom: 15, animate: true,
    });
  } else if (screen === "distance" && shapeOutline.length > 2) {
    const latitudeDelta = (areaKm / 6371) * (180 / Math.PI);
    const longitudeDelta =
      latitudeDelta / Math.max(Math.cos((selectedPlace.latitude * Math.PI) / 180), 0.01);
    const areaBounds = L.latLngBounds(
      [selectedPlace.latitude - latitudeDelta, selectedPlace.longitude - longitudeDelta],
      [selectedPlace.latitude + latitudeDelta, selectedPlace.longitude + longitudeDelta],
    );
    map.fitBounds(areaBounds, {
      paddingTopLeft, paddingBottomRight, maxZoom: 14, animate: true,
    });
  } else {
    map.flyTo([selectedPlace.latitude, selectedPlace.longitude], 13, { duration: 0.8 });
  }
}

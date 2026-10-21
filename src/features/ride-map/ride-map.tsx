import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import { fitRideMap } from "./map-camera";
import { drawMapOverlays } from "./map-overlays";
import type { RideMapProps } from "./types";

export function RideMap({
  screen, selectedPlace, shapeOutline, distance, areaKm, cyclingRoute,
}: RideMapProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const overlaysRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!elementRef.current || mapRef.current) return;
    const map = L.map(elementRef.current, {
      center: [40.76, -73.969],
      zoom: 14,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      dragging: true,
      touchZoom: true,
      keyboard: true,
      boxZoom: true,
    });
    mapRef.current = map;
    overlaysRef.current = L.layerGroup().addTo(map);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 17,
      crossOrigin: true,
    }).addTo(map);
    L.control.attribution({ position: "bottomright", prefix: false }).addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
      overlaysRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const timeout = window.setTimeout(() => map.invalidateSize(), 120);
    return () => window.clearTimeout(timeout);
  }, [screen]);

  useEffect(() => {
    const overlays = overlaysRef.current;
    if (overlays) drawMapOverlays(overlays, {
      screen, selectedPlace, shapeOutline, distance, areaKm, cyclingRoute,
    });
  }, [screen, selectedPlace, shapeOutline, distance, areaKm, cyclingRoute]);

  useEffect(() => {
    const map = mapRef.current;
    if (map) fitRideMap(map, elementRef.current, {
      screen, selectedPlace, shapeOutline, distance, areaKm, cyclingRoute,
    });
  }, [screen, selectedPlace, shapeOutline, distance, areaKm, cyclingRoute]);

  return (
    <div
      ref={elementRef}
      className="map-preview"
      aria-label={selectedPlace ? `Map centered on ${selectedPlace.name}` : "Map preview of a sample cycling route"}
    />
  );
}

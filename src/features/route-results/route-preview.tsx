import type { CyclingRoute } from "@/features/ride-planning/cycling-route";

export function RoutePreview({ route }: { route: CyclingRoute }) {
  const coordinates = route.coordinates;
  const centerLatitude =
    coordinates.reduce((sum, [latitude]) => sum + latitude, 0) / coordinates.length;
  const centerLongitude =
    coordinates.reduce((sum, [, longitude]) => sum + longitude, 0) / coordinates.length;
  const projected = coordinates.map(([latitude, longitude]) => [
    (longitude - centerLongitude) * Math.cos((centerLatitude * Math.PI) / 180),
    latitude - centerLatitude,
  ]);
  const xs = projected.map(([x]) => x);
  const ys = projected.map(([, y]) => y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const width = maxX - minX || 1;
  const height = maxY - minY || 1;
  const scale = Math.min(256 / width, 126 / height);
  const routePoints = projected.map(([projectedX, projectedY]) => {
    const x = 140 + (projectedX - (minX + maxX) / 2) * scale;
    const y = 75 - (projectedY - (minY + maxY) / 2) * scale;
    return `${x},${y}`;
  }).join(" ");
  const [startX, startY] = routePoints.split(" ")[0].split(",");

  return (
    <svg className="cycling-route-preview" viewBox="0 0 280 150" role="img" aria-label="Map-matched bicycle route">
      <polyline points={routePoints} fill="none" stroke="#211f1c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={startX} cy={startY} r="4" fill="#df694f" />
    </svg>
  );
}

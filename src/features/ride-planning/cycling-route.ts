import type { DrawPoint } from "@/features/shapes/types";

export type Coordinate = [latitude: number, longitude: number];

export type CyclingRoute = {
  coordinates: Coordinate[];
  distanceKm: number;
  durationMinutes: number;
  targetDistanceKm: number;
};

const MAX_SHAPE_POINTS = 48;

function sampleOutline(points: DrawPoint[]) {
  if (points.length < 3) {
    throw new Error("Choose a shape or draw a complete outline first.");
  }

  const stride = Math.max(1, Math.ceil(points.length / MAX_SHAPE_POINTS));
  const sampled = points.filter((_, index) => index % stride === 0);
  if (sampled.length < 3) {
    throw new Error("Choose a shape or draw a complete outline first.");
  }

  const xs = sampled.map(([x]) => x);
  const ys = sampled.map(([, y]) => y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const width = maxX - minX;
  const height = maxY - minY;
  const span = Math.max(width, height);

  if (span < 1) {
    throw new Error("Draw a shape with a little more width and height.");
  }

  return sampled.map(([x, y]): DrawPoint => [
    (x - (minX + maxX) / 2) / span,
    (y - (minY + maxY) / 2) / span,
  ]);
}

export function buildShapeCoordinates(
  points: DrawPoint[],
  place: Coordinate,
  targetDistanceKm: number,
  areaKm: number,
): Coordinate[] {
  if (!Number.isFinite(targetDistanceKm) || targetDistanceKm <= 0) {
    throw new Error("Choose a valid target distance.");
  }
  if (!Number.isFinite(areaKm) || areaKm <= 0) {
    throw new Error("Choose a valid area radius.");
  }

  const outline = sampleOutline(points);
  let outlineLength = 0;
  let maxRadius = 0;
  for (let index = 0; index < outline.length; index += 1) {
    const [x, y] = outline[index];
    const [nextX, nextY] = outline[(index + 1) % outline.length];
    outlineLength += Math.hypot(nextX - x, nextY - y);
    maxRadius = Math.max(maxRadius, Math.hypot(x, y));
  }
  if (outlineLength === 0 || maxRadius === 0) {
    throw new Error("Could not read the selected shape.");
  }

  const kmPerUnit = Math.min(targetDistanceKm / outlineLength, (areaKm * 0.95) / maxRadius);
  const latitudeRadians = (place[0] * Math.PI) / 180;

  return outline.map(([x, y]): Coordinate => {
    const eastKm = x * kmPerUnit;
    const northKm = -y * kmPerUnit;
    const latitude = place[0] + northKm / 110.574;
    const longitude = place[1] + eastKm / (111.32 * Math.cos(latitudeRadians));
    return [latitude, longitude];
  });
}

function distanceBetweenKm([latitudeA, longitudeA]: Coordinate, [latitudeB, longitudeB]: Coordinate) {
  const radians = Math.PI / 180;
  const latitudeDelta = (latitudeB - latitudeA) * radians;
  const longitudeDelta = (longitudeB - longitudeA) * radians;
  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(latitudeA * radians) *
      Math.cos(latitudeB * radians) *
      Math.sin(longitudeDelta / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function decodePolyline6(encoded: string): Coordinate[] {
  const coordinates: Coordinate[] = [];
  let index = 0;
  let latitude = 0;
  let longitude = 0;

  while (index < encoded.length) {
    const deltas: number[] = [];
    for (let pair = 0; pair < 2; pair += 1) {
      let result = 0;
      let shift = 0;
      let chunk: number;
      do {
        if (index >= encoded.length) throw new Error("The routing service returned an invalid route.");
        chunk = encoded.charCodeAt(index++) - 63;
        result |= (chunk & 0x1f) << shift;
        shift += 5;
      } while (chunk >= 0x20);
      deltas.push(result & 1 ? ~(result >> 1) : result >> 1);
    }
    latitude += deltas[0];
    longitude += deltas[1];
    coordinates.push([latitude / 1e6, longitude / 1e6]);
  }
  return coordinates;
}

type ValhallaTraceResponse = {
  trip?: {
    summary?: { length?: number; time?: number };
    legs?: Array<{
      shape?: string;
      summary?: { length?: number; time?: number };
    }>;
  };
  error?: string;
};

async function requestMapMatchedShape(
  coordinates: Coordinate[],
  signal?: AbortSignal,
): Promise<CyclingRoute> {
  const request = {
    shape: coordinates.map(([lat, lon]) => ({ lat, lon })),
    costing: "bicycle",
    shape_match: "map_snap",
    costing_options: { bicycle: { use_roads: 0.2 } },
    units: "kilometers",
  };
  const params = new URLSearchParams({ json: JSON.stringify(request) });
  const response = await fetch(`https://valhalla1.openstreetmap.de/trace_route?${params}`, { signal });
  if (!response.ok) {
    throw new Error("Could not find a bike route right now. Please try again.");
  }
  const data = (await response.json()) as ValhallaTraceResponse;
  if (data.error || !data.trip?.legs?.length) {
    throw new Error(data.error || "No bike route was found for this shape and location.");
  }
  const legs = data.trip.legs;
  const routeCoordinates = legs.flatMap((leg, index) => {
    if (!leg.shape) return [];
    const decoded = decodePolyline6(leg.shape);
    return index > 0 ? decoded.slice(1) : decoded;
  });
  const distanceKm = data.trip.summary?.length ??
    legs.reduce((sum, leg) => sum + (leg.summary?.length ?? 0), 0);
  const durationSeconds = data.trip.summary?.time ??
    legs.reduce((sum, leg) => sum + (leg.summary?.time ?? 0), 0);
  if (routeCoordinates.length < 2 || !Number.isFinite(distanceKm) || distanceKm <= 0) {
    throw new Error("The routing service returned an incomplete bike route.");
  }
  return {
    coordinates: routeCoordinates,
    distanceKm,
    durationMinutes: Math.round(durationSeconds / 60),
    targetDistanceKm: distanceKm,
  };
}

export async function findCyclingRoute(
  points: DrawPoint[],
  place: Coordinate,
  targetDistanceKm: number,
  areaKm: number,
  signal?: AbortSignal,
): Promise<CyclingRoute> {
  const shape = buildShapeCoordinates(points, place, targetDistanceKm, areaKm);
  shape.push(shape[0]);
  const route = await requestMapMatchedShape(shape, signal);
  if (!route || route.coordinates.length < 2) {
    throw new Error("No bike route was found for this shape and location.");
  }
  const maxRadiusKm = Math.max(
    ...route.coordinates.map((coordinate) => distanceBetweenKm(place, coordinate)),
  );
  if (maxRadiusKm > areaKm) {
    throw new Error("This shape does not fit inside the selected area. Increase the area and try again.");
  }
  return { ...route, targetDistanceKm };
}

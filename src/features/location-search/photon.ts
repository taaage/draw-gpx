import type { Place } from "./types";

type PhotonResponse = {
  features?: Array<{
    geometry?: { coordinates?: [number, number] };
    properties?: {
      name?: string;
      city?: string;
      county?: string;
      state?: string;
      country?: string;
    };
  }>;
};

export async function searchPlaces(query: string, signal: AbortSignal): Promise<Place[]> {
  const params = new URLSearchParams({ q: query, limit: "6" });
  const response = await fetch(`https://photon.komoot.io/api/?${params}`, { signal });
  if (!response.ok) throw new Error(`Location search failed (${response.status}).`);

  const data = (await response.json()) as PhotonResponse;
  return (data.features ?? []).flatMap((feature) => {
    const coordinates = feature.geometry?.coordinates;
    const properties = feature.properties;
    if (!coordinates || !properties) return [];
    const name = [
      properties.name, properties.city, properties.state, properties.country,
    ]
      .filter((part, index, parts): part is string => Boolean(part) && parts.indexOf(part) === index)
      .join(", ");
    if (!name) return [];
    return [{ name, longitude: coordinates[0], latitude: coordinates[1] }];
  });
}

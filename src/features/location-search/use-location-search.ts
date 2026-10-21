import { useEffect, useState } from "react";
import { searchPlaces } from "./photon";
import type { Place } from "./types";

export function useLocationSearch(query: string) {
  const [places, setPlaces] = useState<Place[]>([]);
  const [searchState, setSearchState] = useState<"idle" | "loading" | "error">("idle");

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setPlaces([]);
      setSearchState("idle");
      return;
    }
    setSearchState("loading");
    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      try {
        setPlaces(await searchPlaces(trimmed, controller.signal));
        setSearchState("idle");
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("Could not search for locations.", error);
        setPlaces([]);
        setSearchState("error");
      }
    }, 350);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  return { places, searchState };
}

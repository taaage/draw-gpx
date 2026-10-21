import type { Place } from "./types";
import type { useLocationSearch } from "./use-location-search";

type LocationPickerProps = ReturnType<typeof useLocationSearch> & {
  query: string;
  selectedPlace: Place | null;
  onQueryChange: (query: string) => void;
  onSelect: (place: Place) => void;
};

export function LocationPicker({
  query, selectedPlace, places, searchState, onQueryChange, onSelect,
}: LocationPickerProps) {
  return (
    <div className="location-picker">
      <label className="location-search">
        <svg viewBox="0 0 24 24" width="19" height="19" fill="none" aria-hidden="true">
          <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.8" />
          <path d="m16 16 4.2 4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          value={selectedPlace?.name ?? query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search a city or address"
          aria-label="Search a city or address"
          autoComplete="off"
        />
        {(query || selectedPlace) && (
          <button type="button" onClick={() => onQueryChange("")} aria-label="Clear search">
            ×
          </button>
        )}
      </label>
      <div className="location-results" aria-live="polite">
        {!selectedPlace && searchState === "loading" && <p className="search-message">Searching places…</p>}
        {!selectedPlace && searchState === "error" && (
          <p className="search-message">Couldn’t search right now. Check your connection and try again.</p>
        )}
        {!selectedPlace && searchState === "idle" && query.trim().length > 1 && places.length === 0 && (
          <p className="search-message">No places found. Try another search.</p>
        )}
        {!selectedPlace && places.map((place) => (
          <button
            key={`${place.name}-${place.latitude}-${place.longitude}`}
            className="place-result"
            type="button"
            onClick={() => onSelect(place)}
          >
            <span className="place-icon" aria-hidden="true">⌖</span>
            <span>{place.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

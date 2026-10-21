# Draw a Ride

A mobile-first cycling route-planning experience.

The current iteration includes a welcome screen, an interactive shape picker with preset shapes and freehand drawing, a combined location/distance/area screen, and an experimental route result. Selecting a place moves the map without accessing device location. The area control sets a circular radius around that location; the selected shape is scaled to the target distance within the circle and submitted to Valhalla's bicycle map-matching service.

## Current limitations

- Route generation is a prototype, not a finished shape-matching algorithm. Valhalla can shortcut the outline or return only a partial match; a successful response does not guarantee a recognizable shape or a closed loop.
- Returned coordinates are checked against the area radius, but shape similarity and target-distance tolerances are not yet validated.
- Bicycle costing favors mapped bike-friendly options, but does not guarantee bike lanes, current access, or real-world safety. Inspect results before riding.
- Distance and time are service estimates and can differ substantially from the requested distance.
- GPX export, alternative routes, persistence, and AI planning are not implemented.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The welcome map preview opens around New York.

## Stack

- Next.js 15, React, and TypeScript
- Leaflet with OpenStreetMap tiles
- Photon geocoding for place search
- Valhalla bicycle routing for shape matching

Map tiles, place search, and route matching require an internet connection. No account or app backend is used.

## Organization

- [app](src/app) contains the Next.js entry points, metadata, design tokens, and global reset.
- [ride-planning](src/features/ride-planning) coordinates the screens and owns distance/area settings and Valhalla route generation.
- [shapes](src/features/shapes) owns presets, outline sampling, and freehand selection state.
- [location-search](src/features/location-search) owns Photon requests, debouncing/cancellation, and the place picker.
- [ride-map](src/features/ride-map) owns Leaflet initialization, overlays, and camera fitting.
- [route-results](src/features/route-results) owns the result card and proportion-preserving route preview.
- [welcome](src/features/welcome) owns the introductory screen and example illustration.
- [shared](src/shared) contains repeated UI controls, not feature-specific services or state.

Keep components, hooks, types, and styles beside the feature that owns them. Import focused modules directly; avoid a catch-all component or utility folder. The planner keeps selection and search hooks mounted across screen changes so back navigation preserves inputs. Feature styles are composed centrally by [globals.css](src/app/globals.css).

## Development checks

```powershell
npm run lint
.\node_modules\.bin\tsc.cmd --noEmit
```

No automated route-quality tests are configured yet. Lint and TypeScript checks do not verify route shape or rideability.

export const TILE_SIZE = 256;
export const MAX_TILE_ZOOM = 19;

/** Web-mercator projection: latitude/longitude to normalised world coordinates (0..1 on both axes). */
export function toWorld(latitude: number, longitude: number) {
  const sin = Math.sin((latitude * Math.PI) / 180);
  return {
    x: (longitude + 180) / 360,
    y: 0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI),
  };
}

/** Great-circle distance between two coordinates, in kilometres (haversine). */
export function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const a =
    Math.sin(toRad(lat2 - lat1) / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(toRad(lon2 - lon1) / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(a));
}

// Public OpenStreetMap tiles: fine for a prototype, but their usage policy forbids heavy production
// traffic. Swap this URL for a hosted tile provider (MapTiler, Mapbox, Stadia...) before release.
export function tileUrl(zoom: number, x: number, y: number) {
  return `https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`;
}

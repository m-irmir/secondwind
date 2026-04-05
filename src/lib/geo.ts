// Nine20 Tempe (920 E Apache Blvd)
export const USER_LAT = 33.4148;
export const USER_LNG = -111.9253;

/** Haversine distance between two lat/lng points, in miles */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 3958.8; // Earth radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Distance from ASU to a given point, in miles */
export function distanceFromUser(lat: number, lng: number): number {
  return haversineDistance(USER_LAT, USER_LNG, lat, lng);
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

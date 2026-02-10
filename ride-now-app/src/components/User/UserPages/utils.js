import { useRef } from "react";
 
export function useDebounce(callback, delay = 300) {
  const timeoutRef = useRef(null);
  return (...args) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}
 
export async function getCoords(place) {
  const res = await fetch(
`https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=in&q=${encodeURIComponent(place)}`
  );
  const data = await res.json();
  if (data && data.length > 0) {
    return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
  }
  return null;
}
 
export function getDistanceKm(coord1, coord2) {
  if (!coord1 || !coord2) return 0;
  const toRad = (val) => (val * Math.PI) / 180;
  const [lat1, lon1] = coord1;
  const [lat2, lon2] = coord2;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return +(R * c).toFixed(2);
}

export function formatPlaceName(placeDisplayName) {
  if (!placeDisplayName) return "";
  const parts = placeDisplayName.split(",");
  // Return the first 2 parts for a cleaner name, or the whole thing if it's short
  if (parts.length > 2) {
    return `${parts[0].trim()}, ${parts[1].trim()}`;
  }
  return placeDisplayName;
}

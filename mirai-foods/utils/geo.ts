import type { Place } from "@/constants/data";

/** Sükhbaatar Square, Ulaanbaatar — default map center when location is unavailable */
export const SUKHBAATAR_SQUARE = {
  latitude: 47.918611,
  longitude: 106.917778,
  label: "Sükhbaatar Square",
} as const;

/** Max distance from city center to treat GPS as valid (laptop/simulator often reports US) */
export const ULAANBAATAR_SERVICE_RADIUS_KM = 50;

export function isInUlaanbaatarServiceArea(
  latitude: number,
  longitude: number
): boolean {
  return (
    distanceKm(
      latitude,
      longitude,
      SUKHBAATAR_SQUARE.latitude,
      SUKHBAATAR_SQUARE.longitude
    ) <= ULAANBAATAR_SERVICE_RADIUS_KM
  );
}

/** Great-circle distance in kilometers */
export function distanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Human-readable distance label for callout (e.g. "0.8KM AWAY") */
export function placeDistanceLabel(
  userLat: number,
  userLon: number,
  place: Place
): string {
  const km = distanceKm(
    userLat,
    userLon,
    place.location.latitude,
    place.location.longitude
  );
  if (km < 10) {
    return `${km.toFixed(1)}KM AWAY`;
  }
  return `${Math.round(km)}KM AWAY`;
}

export type PlaceCategory = "bakery" | "restaurant";

export function getPlaceCategory(place: Place): PlaceCategory {
  const name = place.name.toLowerCase();
  if (
    name.includes("bakery") ||
    name.includes("dough") ||
    name.includes("cupcake") ||
    name.includes("bono") ||
    name.includes("maison")
  ) {
    return "bakery";
  }
  return "restaurant";
}

export function getPlaceRating(place: Place): number {
  const seed = place.id.split("").reduce((s, c) => s + c.charCodeAt(0), 0);
  return Math.round((4 + (seed % 8) / 10) * 10) / 10;
}

export const RADIUS_OPTIONS_KM = [1, 3, 5, 10] as const;
export type RadiusKm = (typeof RADIUS_OPTIONS_KM)[number];

/** Smaller search radius → larger pins; larger radius → smaller pins (less clutter) */
export function getMarkerDimensions(
  radiusKm: RadiusKm,
  isSelected: boolean
): {
  size: number;
  iconSize: number;
} {
  const byRadius: Record<
    RadiusKm,
    { size: number; selectedSize: number; icon: number; iconSelected: number }
  > = {
    1: { size: 50, selectedSize: 54, icon: 22, iconSelected: 24 },
    3: { size: 44, selectedSize: 48, icon: 18, iconSelected: 20 },
    5: { size: 38, selectedSize: 42, icon: 16, iconSelected: 18 },
    10: { size: 30, selectedSize: 34, icon: 13, iconSelected: 15 },
  };
  const c = byRadius[radiusKm];
  return {
    size: isSelected ? c.selectedSize : c.size,
    iconSize: isSelected ? c.iconSelected : c.icon,
  };
}

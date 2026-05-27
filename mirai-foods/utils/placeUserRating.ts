/** In-session user star ratings for sellers (1–5) */
const ratings = new Map<string, number>();

export function getUserPlaceRating(placeId: string): number | null {
  const value = ratings.get(placeId);
  return value != null ? value : null;
}

export function setUserPlaceRating(placeId: string, stars: number): void {
  const clamped = Math.min(5, Math.max(1, Math.round(stars)));
  ratings.set(placeId, clamped);
}

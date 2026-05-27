import { Alert, Linking, Platform } from "react-native";

type Coordinates = {
  latitude: number;
  longitude: number;
};

type Options = {
  label?: string;
  /** When set, navigation starts from the user's position */
  origin?: Coordinates;
};

/**
 * Opens Google Maps / Apple Maps with driving directions to a place.
 */
export async function openDirectionsToPlace(
  destination: Coordinates,
  options?: Options
): Promise<void> {
  const { latitude, longitude } = destination;
  const dest = `${latitude},${longitude}`;
  const label = options?.label ? encodeURIComponent(options.label) : "";
  const origin = options?.origin
    ? `${options.origin.latitude},${options.origin.longitude}`
    : null;

  const googleDir = origin
    ? `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}&travelmode=driving`
    : `https://www.google.com/maps/dir/?api=1&destination=${dest}&travelmode=driving`;

  const candidates: string[] = [];

  if (Platform.OS === "ios") {
    candidates.push(
      origin
        ? `maps://?saddr=${origin}&daddr=${dest}&dirflg=d`
        : `maps://?daddr=${dest}&dirflg=d`
    );
    if (label) {
      candidates.push(`http://maps.apple.com/?daddr=${dest}&dirflg=d`);
    }
  }

  if (Platform.OS === "android") {
    candidates.push(`google.navigation:q=${latitude},${longitude}&mode=d`);
    candidates.push(`geo:0,0?q=${latitude},${longitude}${label ? `(${label})` : ""}`);
  }

  candidates.push(googleDir);

  for (const url of candidates) {
    try {
      await Linking.openURL(url);
      return;
    } catch {
      // try next URL scheme
    }
  }

  Alert.alert(
    "Maps unavailable",
    "Install Google Maps or Apple Maps to get turn-by-turn directions."
  );
}

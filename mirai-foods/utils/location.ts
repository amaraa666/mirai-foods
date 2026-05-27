import { Platform } from "react-native";
import * as Location from "expo-location";
import { isInUlaanbaatarServiceArea } from "@/utils/geo";

/** Prefer a real Ulaanbaatar fix; simulators/laptops often report US coordinates. */
export async function fetchNearMePosition(): Promise<Location.LocationObject | null> {
  const isValid = (loc: Location.LocationObject) =>
    isInUlaanbaatarServiceArea(loc.coords.latitude, loc.coords.longitude);

  const { status } = await Location.getForegroundPermissionsAsync();
  if (status !== "granted") {
    const requested = await Location.requestForegroundPermissionsAsync();
    if (requested.status !== "granted") return null;
  }

  try {
    const last = await Location.getLastKnownPositionAsync({
      maxAge: 60_000,
      requiredAccuracy: 500,
    });
    if (last && isValid(last)) return last;
  } catch {
    // ignore
  }

  try {
    const current = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });
    if (isValid(current)) return current;
  } catch {
    // ignore
  }

  if (Platform.OS === "web") {
    return null;
  }

  return new Promise((resolve) => {
    let subscription: Location.LocationSubscription | null = null;
    const timeout = setTimeout(() => {
      subscription?.remove();
      resolve(null);
    }, 10_000);

    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        distanceInterval: 5,
        timeInterval: 1000,
      },
      (update) => {
        if (isValid(update)) {
          clearTimeout(timeout);
          subscription?.remove();
          resolve(update);
        }
      }
    )
      .then((sub) => {
        subscription = sub;
      })
      .catch(() => {
        clearTimeout(timeout);
        resolve(null);
      });
  });
}

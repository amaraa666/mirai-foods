import { forwardRef } from "react";
import { Platform } from "react-native";
import MapView, {
  MapViewProps,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import { LIGHT_MAP_STYLE } from "@/constants/mapStyle";

/** Google Maps on Android (required for Expo Go & production). Default on iOS. */
export const MAP_PROVIDER =
  Platform.OS === "android" ? PROVIDER_GOOGLE : undefined;

const AppMapView = forwardRef<MapView, MapViewProps>(function AppMapView(
  { customMapStyle = LIGHT_MAP_STYLE, ...props },
  ref
) {
  return (
    <MapView
      ref={ref}
      provider={MAP_PROVIDER}
      customMapStyle={customMapStyle}
      {...props}
    />
  );
});

export default AppMapView;

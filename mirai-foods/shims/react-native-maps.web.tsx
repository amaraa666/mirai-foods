/**
 * Web stub for react-native-maps — the real package uses native codegen and
 * cannot run on web or in Expo static SSR. Metro resolves this file instead
 * of node_modules/react-native-maps when platform === 'web' (see metro.config.js).
 */
import React, { PropsWithChildren } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ViewProps,
} from "react-native";

type MapViewProps = PropsWithChildren<
  ViewProps & {
    initialRegion?: unknown;
    showsUserLocation?: boolean;
    showsMyLocationButton?: boolean;
  }
>;

export default function MapView({ style, children }: MapViewProps) {
  return (
    <View style={[styles.map, style]}>
      <Text style={styles.hint}>
        Interactive map runs on iOS and Android. Tap a bakery below.
      </Text>
      <View style={styles.markerColumn}>{children}</View>
    </View>
  );
}

export type MarkerProps = {
  coordinate?: { latitude: number; longitude: number };
  title?: string;
  description?: string;
  pinColor?: string;
  onPress?: () => void;
};

export function Marker({ title, description, onPress }: MarkerProps) {
  if (!title) return null;
  return (
    <Pressable onPress={onPress} style={styles.marker}>
      <Text style={styles.markerTitle}>{title}</Text>
      {description ? (
        <Text style={styles.markerDesc}>{description}</Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
    backgroundColor: "#e8f4f2",
    justifyContent: "flex-start",
    padding: 12,
  },
  hint: {
    fontSize: 13,
    color: "#555",
    textAlign: "center",
    marginBottom: 12,
  },
  markerColumn: {
    gap: 8,
  },
  marker: {
    backgroundColor: "rgba(42, 157, 143, 0.2)",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  markerTitle: {
    fontWeight: "700",
    fontSize: 14,
    color: "#1d3557",
  },
  markerDesc: {
    fontSize: 12,
    color: "#457b9d",
    marginTop: 4,
  },
});

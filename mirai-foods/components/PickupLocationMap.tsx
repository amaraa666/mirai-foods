import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MapView, { Marker, Polyline, Region } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import AppMapView from "@/components/AppMapView";
import type { Place } from "@/constants/data";
import { placeDistanceLabel } from "@/utils/geo";
import { fetchNearMePosition } from "@/utils/location";

const PRIMARY = "#4A151B";
const TEXT_PRIMARY = "#2D2926";
const TEXT_SECONDARY = "#757575";

type Props = {
  place: Place;
};

function previewRegion(place: Place): Region {
  return {
    latitude: place.location.latitude,
    longitude: place.location.longitude,
    latitudeDelta: 0.008,
    longitudeDelta: 0.008,
  };
}

function zoomRegion(region: Region, factor: number): Region {
  return {
    ...region,
    latitudeDelta: Math.min(
      2,
      Math.max(0.0008, region.latitudeDelta * factor)
    ),
    longitudeDelta: Math.min(
      2,
      Math.max(0.0008, region.longitudeDelta * factor)
    ),
  };
}

export function PickupLocationMap({ place }: Props) {
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const regionRef = useRef<Region>(previewRegion(place));
  const [expanded, setExpanded] = useState(false);
  const [userCoord, setUserCoord] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [hasGps, setHasGps] = useState(false);

  const fitMapToPoints = useCallback(
    (user: { latitude: number; longitude: number } | null) => {
      requestAnimationFrame(() => {
        if (!user) {
          const next = {
            ...previewRegion(place),
            latitudeDelta: 0.035,
            longitudeDelta: 0.035,
          };
          regionRef.current = next;
          mapRef.current?.animateToRegion(next, 400);
          return;
        }
        mapRef.current?.fitToCoordinates([user, place.location], {
          edgePadding: {
            top: insets.top + 120,
            right: 48,
            bottom: insets.bottom + 140,
            left: 48,
          },
          animated: true,
        });
      });
    },
    [place, insets.top, insets.bottom]
  );

  const handleRegionChange = useCallback((region: Region) => {
    regionRef.current = region;
  }, []);

  const zoomIn = useCallback(() => {
    const next = zoomRegion(regionRef.current, 0.5);
    regionRef.current = next;
    mapRef.current?.animateToRegion(next, 200);
  }, []);

  const zoomOut = useCallback(() => {
    const next = zoomRegion(regionRef.current, 2);
    regionRef.current = next;
    mapRef.current?.animateToRegion(next, 200);
  }, []);

  const loadUserLocation = useCallback(async () => {
    setLocationLoading(true);
    const loc = await fetchNearMePosition();
    if (loc) {
      const coord = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };
      setUserCoord(coord);
      setHasGps(true);
      if (expanded) fitMapToPoints(coord);
    } else {
      setUserCoord(null);
      setHasGps(false);
      if (expanded) fitMapToPoints(null);
    }
    setLocationLoading(false);
  }, [expanded, fitMapToPoints]);

  useEffect(() => {
    if (expanded) {
      loadUserLocation();
    }
  }, [expanded, loadUserLocation]);

  const distanceText =
    userCoord != null
      ? placeDistanceLabel(
          userCoord.latitude,
          userCoord.longitude,
          place
        )
      : null;

  const openExpanded = () => {
    setExpanded(true);
  };

  const handleLocateMe = () => {
    loadUserLocation();
  };

  return (
    <>
      <Pressable
        style={styles.previewWrap}
        onPress={openExpanded}
        accessibilityRole="button"
        accessibilityLabel="Open full pickup map"
      >
        <AppMapView
          style={styles.previewMap}
          initialRegion={previewRegion(place)}
          scrollEnabled={false}
          zoomEnabled={false}
          rotateEnabled={false}
          pitchEnabled={false}
          pointerEvents="none"
          userInterfaceStyle="light"
          toolbarEnabled={false}
        >
          <Marker
            coordinate={place.location}
            anchor={{ x: 0.5, y: 1 }}
            tracksViewChanges={false}
          >
            <View style={styles.pickupMarker}>
              <Feather name="map-pin" size={20} color="#fff" />
            </View>
          </Marker>
        </AppMapView>
        <View style={styles.expandOverlay}>
          <Feather name="maximize-2" size={18} color="#fff" />
          <Text style={styles.expandText}>Tap to open full map</Text>
        </View>
      </Pressable>

      <Modal
        visible={expanded}
        animationType="slide"
        onRequestClose={() => setExpanded(false)}
      >
        <View style={styles.modalRoot}>
          <View style={[styles.modalHeader, { paddingTop: insets.top + 8 }]}>
            <Pressable
              style={styles.closeBtn}
              onPress={() => setExpanded(false)}
              hitSlop={12}
            >
              <Feather name="x" size={24} color={TEXT_PRIMARY} />
            </Pressable>
            <View style={styles.modalHeaderText}>
              <Text style={styles.modalTitle} numberOfLines={1}>
                {place.name}
              </Text>
              <Text style={styles.modalAddress} numberOfLines={2}>
                {place.address}
              </Text>
              {distanceText && (
                <Text style={styles.modalDistance}>{distanceText}</Text>
              )}
            </View>
          </View>

          <AppMapView
            ref={mapRef}
            style={styles.fullMap}
            initialRegion={previewRegion(place)}
            scrollEnabled
            zoomEnabled
            zoomTapEnabled
            zoomControlEnabled={Platform.OS === "android"}
            rotateEnabled={false}
            pitchEnabled={false}
            showsUserLocation={hasGps}
            showsMyLocationButton={false}
            userInterfaceStyle="light"
            toolbarEnabled={false}
            onRegionChangeComplete={handleRegionChange}
            onMapReady={() => fitMapToPoints(userCoord)}
          >
            <Marker
              coordinate={place.location}
              anchor={{ x: 0.5, y: 1 }}
              tracksViewChanges={false}
            >
              <View style={styles.pickupMarkerLarge}>
                <Feather name="shopping-bag" size={18} color="#fff" />
              </View>
            </Marker>
            {userCoord && (
              <Polyline
                coordinates={[userCoord, place.location]}
                strokeColor="rgba(74, 21, 27, 0.45)"
                strokeWidth={3}
                {...(Platform.OS === "ios"
                  ? { lineDashPattern: [8, 6] as number[] }
                  : {})}
              />
            )}
          </AppMapView>

          <View
            style={[
              styles.zoomControls,
              { top: insets.top + 88, bottom: insets.bottom + 120 },
            ]}
            pointerEvents="box-none"
          >
            <Pressable
              style={styles.zoomBtn}
              onPress={zoomIn}
              accessibilityLabel="Zoom in"
            >
              <Feather name="plus" size={22} color={PRIMARY} />
            </Pressable>
            <Pressable
              style={styles.zoomBtn}
              onPress={zoomOut}
              accessibilityLabel="Zoom out"
            >
              <Feather name="minus" size={22} color={PRIMARY} />
            </Pressable>
          </View>

          <View
            style={[
              styles.modalFooter,
              { paddingBottom: insets.bottom + 16 },
            ]}
            pointerEvents="box-none"
          >
            <Text style={styles.zoomHint}>Pinch or use + / − to zoom</Text>
            <View style={styles.legend} pointerEvents="auto">
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, styles.legendPickup]} />
                <Text style={styles.legendText}>Pickup</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, styles.legendYou]} />
                <Text style={styles.legendText}>You</Text>
              </View>
            </View>
            {!hasGps && !locationLoading && (
              <Text style={styles.gpsHint}>
                Enable location to see where you are relative to pickup
              </Text>
            )}
            <Pressable
              style={styles.locateBtn}
              onPress={handleLocateMe}
              pointerEvents="auto"
            >
              {locationLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Feather name="crosshair" size={20} color="#fff" />
                  <Text style={styles.locateText}>My location</Text>
                </>
              )}
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  previewWrap: {
    height: 160,
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 24,
    backgroundColor: "#F5F0EA",
  },
  previewMap: {
    width: "100%",
    height: "100%",
  },
  expandOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(45, 41, 38, 0.35)",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  expandText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  modalRoot: {
    flex: 1,
    backgroundColor: "#FDF8F5",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "#FDF8F5",
    gap: 8,
    zIndex: 2,
  },
  closeBtn: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  modalHeaderText: {
    flex: 1,
    paddingTop: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: PRIMARY,
    marginBottom: 4,
    fontFamily: Platform.select({ ios: "Georgia", android: "serif" }),
  },
  modalAddress: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    lineHeight: 20,
  },
  modalDistance: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.6,
    color: PRIMARY,
    textTransform: "uppercase",
  },
  fullMap: {
    flex: 1,
  },
  zoomControls: {
    position: "absolute",
    right: 16,
    justifyContent: "center",
    gap: 10,
    zIndex: 5,
  },
  zoomBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  zoomHint: {
    fontSize: 12,
    color: TEXT_SECONDARY,
    backgroundColor: "rgba(255,255,255,0.92)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: "flex-start",
    overflow: "hidden",
  },
  modalFooter: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 10,
  },
  legend: {
    flexDirection: "row",
    gap: 20,
    backgroundColor: "rgba(255,255,255,0.95)",
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendPickup: {
    backgroundColor: PRIMARY,
  },
  legendYou: {
    backgroundColor: "#1E88E5",
  },
  legendText: {
    fontSize: 13,
    fontWeight: "600",
    color: TEXT_PRIMARY,
  },
  gpsHint: {
    fontSize: 12,
    color: TEXT_SECONDARY,
    backgroundColor: "rgba(255,255,255,0.92)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    overflow: "hidden",
  },
  locateBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    alignSelf: "flex-end",
    backgroundColor: PRIMARY,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 28,
    minWidth: 150,
  },
  locateText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  pickupMarker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  pickupMarkerLarge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

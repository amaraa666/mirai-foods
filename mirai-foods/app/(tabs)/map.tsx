import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import MapView, { Circle, Marker, Region } from "react-native-maps";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Location from "expo-location";
import Feather from "@expo/vector-icons/Feather";
import { NotificationBell } from "@/components/NotificationBell";

import AppMapView from "@/components/AppMapView";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PlaceMapMarker } from "@/components/PlaceMapMarker";
import { getMainMenuPlaces, Place } from "@/constants/data";
import {
  distanceKm,
  getMarkerDimensions,
  getPlaceCategory,
  getPlaceRating,
  isInUlaanbaatarServiceArea,
  placeDistanceLabel,
  RADIUS_OPTIONS_KM,
  RadiusKm,
  SUKHBAATAR_SQUARE,
} from "@/utils/geo";
import { fetchNearMePosition } from "@/utils/location";
import { openDirectionsToPlace } from "@/utils/openDirections";

const BG = "#FAF7F4";
const PRIMARY = "#4A151B";
const TEXT_PRIMARY = "#1a1a1a";
const TEXT_SECONDARY = "#888";
const CARD_SHADOW = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 4,
};

const DEFAULT_REGION: Region = {
  latitude: SUKHBAATAR_SQUARE.latitude,
  longitude: SUKHBAATAR_SQUARE.longitude,
  latitudeDelta: 0.06,
  longitudeDelta: 0.06,
};

function regionForRadius(
  lat: number,
  lon: number,
  radiusKm: number
): Region {
  const delta = Math.max(0.02, radiusKm / 111 * 2.2);
  return {
    latitude: lat,
    longitude: lon,
    latitudeDelta: delta,
    longitudeDelta: delta,
  };
}

function MapScreenContent() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const markerPressRef = useRef(false);

  const [userLocation, setUserLocation] =
    useState<Location.LocationObject | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationDenied, setLocationDenied] = useState(false);
  const [locationOutsideService, setLocationOutsideService] = useState(false);
  const [radiusKm, setRadiusKm] = useState<RadiusKm>(5);
  const [radiusModalVisible, setRadiusModalVisible] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const centerOnSukhbaatar = useCallback(() => {
    setUserLocation(null);
    const region = regionForRadius(
      SUKHBAATAR_SQUARE.latitude,
      SUKHBAATAR_SQUARE.longitude,
      radiusKm
    );
    mapRef.current?.animateToRegion(region, 400);
  }, [radiusKm]);

  const refreshLocation = useCallback(async () => {
    setLocationLoading(true);
    setLocationOutsideService(false);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setLocationDenied(true);
      centerOnSukhbaatar();
      setLocationLoading(false);
      return;
    }
    setLocationDenied(false);
    const loc = await fetchNearMePosition();
    if (loc) {
      setUserLocation(loc);
      setLocationOutsideService(false);
      const region = regionForRadius(
        loc.coords.latitude,
        loc.coords.longitude,
        radiusKm
      );
      mapRef.current?.animateToRegion(region, 400);
    } else {
      setUserLocation(null);
      setLocationOutsideService(true);
      centerOnSukhbaatar();
    }
    setLocationLoading(false);
  }, [radiusKm, centerOnSukhbaatar]);

  useEffect(() => {
    refreshLocation();
  }, []);

  const hasNearMeGps = useMemo(
    () =>
      !!userLocation &&
      !locationDenied &&
      isInUlaanbaatarServiceArea(
        userLocation.coords.latitude,
        userLocation.coords.longitude
      ),
    [userLocation, locationDenied]
  );

  const mapCenter = useMemo(() => {
    if (hasNearMeGps && userLocation) {
      return {
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
      };
    }
    return {
      latitude: SUKHBAATAR_SQUARE.latitude,
      longitude: SUKHBAATAR_SQUARE.longitude,
    };
  }, [hasNearMeGps, userLocation]);

  useEffect(() => {
    if (!mapReady) return;
    const region = regionForRadius(
      mapCenter.latitude,
      mapCenter.longitude,
      radiusKm
    );
    mapRef.current?.animateToRegion(region, 350);
  }, [radiusKm, mapCenter.latitude, mapCenter.longitude, mapReady]);

  const mainMenuPlaces = useMemo(() => getMainMenuPlaces(), []);

  const placesInRadius = useMemo(() => {
    const { latitude, longitude } = mapCenter;
    return mainMenuPlaces.filter(
      (p) =>
        distanceKm(
          latitude,
          longitude,
          p.location.latitude,
          p.location.longitude
        ) <= radiusKm
    );
  }, [mapCenter, radiusKm, mainMenuPlaces]);

  useEffect(() => {
    if (
      selectedPlace &&
      !placesInRadius.some((p) => p.id === selectedPlace.id)
    ) {
      setSelectedPlace(null);
    }
  }, [placesInRadius, selectedPlace]);

  const handleMapPress = () => {
    if (markerPressRef.current) return;
    setSelectedPlace(null);
  };

  const handleMarkerPress = (place: Place) => {
    markerPressRef.current = true;
    setSelectedPlace((prev) => (prev?.id === place.id ? null : place));
    setTimeout(() => {
      markerPressRef.current = false;
    }, 200);
  };

  const distanceLabel = useMemo(() => {
    if (!selectedPlace) return "—";
    return placeDistanceLabel(
      mapCenter.latitude,
      mapCenter.longitude,
      selectedPlace
    );
  }, [selectedPlace, mapCenter]);

  const handleLocateMe = () => {
    if (hasNearMeGps && userLocation) {
      const region = regionForRadius(
        userLocation.coords.latitude,
        userLocation.coords.longitude,
        radiusKm
      );
      mapRef.current?.animateToRegion(region, 400);
      return;
    }
    refreshLocation();
  };

  const selectRadius = (km: RadiusKm) => {
    setRadiusKm(km);
    setRadiusModalVisible(false);
  };

  const getDirectionsOrigin = () =>
    hasNearMeGps && userLocation
      ? {
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
        }
      : undefined;

  const handleGetDirections = async () => {
    if (!selectedPlace) return;
    try {
      await openDirectionsToPlace(selectedPlace.location, {
        label: selectedPlace.name,
        origin: getDirectionsOrigin(),
      });
    } catch {
      Alert.alert(
        "Directions",
        "Could not open maps. Check that Google Maps or Apple Maps is installed."
      );
    }
  };

  const openPlacePage = () => {
    if (!selectedPlace) return;
    router.push({
      pathname: "/place/[id]",
      params: {
        id: selectedPlace.id,
        distance: distanceLabel !== "—" ? distanceLabel : "",
      },
    });
  };

  return (
    <View style={styles.root}>
      <AppMapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={DEFAULT_REGION}
        onMapReady={() => setMapReady(true)}
        onPress={handleMapPress}
        showsUserLocation={hasNearMeGps}
        showsMyLocationButton={false}
        userInterfaceStyle="light"
        toolbarEnabled={false}
      >
        <Circle
          center={mapCenter}
          radius={radiusKm * 1000}
          strokeColor="rgba(74, 21, 27, 0.55)"
          fillColor="rgba(74, 21, 27, 0.1)"
          strokeWidth={2}
        />
        {!hasNearMeGps && (
          <Marker
            coordinate={SUKHBAATAR_SQUARE}
            tracksViewChanges={false}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={styles.centerDot}>
              <View style={styles.centerDotInner} />
            </View>
          </Marker>
        )}
        {placesInRadius.map((place) => {
          const category = getPlaceCategory(place);
          const isSelected = selectedPlace?.id === place.id;
          const { size, iconSize } = getMarkerDimensions(radiusKm, isSelected);
          return (
            <Marker
              key={place.id}
              coordinate={place.location}
              onPress={() => handleMarkerPress(place)}
              tracksViewChanges={false}
            >
              <PlaceMapMarker
                category={category}
                size={size}
                iconSize={iconSize}
                selected={isSelected}
              />
            </Marker>
          );
        })}
      </AppMapView>

      {/* Header overlay */}
      <View
        style={[
          styles.headerOverlay,
          { paddingTop: insets.top + 8 },
          CARD_SHADOW,
        ]}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatar}>
              <Image
                source={{ uri: "https://i.pravatar.cc/100" }}
                style={styles.avatarImage}
              />
            </View>
            <Text style={styles.brandName}>Savor</Text>
          </View>
          <NotificationBell color={PRIMARY} size={22} style={styles.bellBtn} />
        </View>

        <Pressable
          style={[styles.radiusBar, CARD_SHADOW]}
          onPress={() => setRadiusModalVisible(true)}
        >
          <Feather name="map-pin" size={20} color={PRIMARY} />
          <Text style={styles.radiusText}>Within {radiusKm}km</Text>
          <Feather name="chevron-down" size={20} color={PRIMARY} />
        </Pressable>

        {locationDenied && (
          <Pressable style={styles.locationHint} onPress={refreshLocation}>
            <Text style={styles.locationHintText}>
              Centered on {SUKHBAATAR_SQUARE.label} — tap to enable your
              location
            </Text>
          </Pressable>
        )}
        {locationOutsideService && !locationDenied && (
          <Pressable style={styles.locationHint} onPress={refreshLocation}>
            <Text style={styles.locationHintText}>
              Your device reported a location outside Ulaanbaatar (often US on
              laptop/simulator). Showing nearby places at{" "}
              {SUKHBAATAR_SQUARE.label} — tap to retry GPS
            </Text>
          </Pressable>
        )}
        {!locationDenied && placesInRadius.length === 0 && !locationLoading && (
          <View style={styles.locationHint}>
            <Text style={styles.locationHintText}>
              No places within {radiusKm}km. Try a larger radius.
            </Text>
          </View>
        )}
      </View>

      {/* Selected place callout */}
      {selectedPlace && (
        <View
          style={[
            styles.callout,
            CARD_SHADOW,
            { bottom: insets.bottom + 88 },
          ]}
        >
          <View style={styles.calloutTop}>
            <View style={styles.calloutTitleBlock}>
              <Text style={styles.calloutName}>{selectedPlace.name}</Text>
              <Text style={styles.calloutDistance}>{distanceLabel}</Text>
            </View>
            <View style={styles.ratingPill}>
              <Text style={styles.ratingText}>
                {getPlaceRating(selectedPlace)}
              </Text>
            </View>
          </View>
          <View style={styles.calloutActions}>
            <Pressable
              style={styles.directionsBtn}
              onPress={handleGetDirections}
            >
              <Feather name="navigation" size={18} color={PRIMARY} />
              <Text style={styles.directionsText}>Directions</Text>
            </Pressable>
            <Pressable style={styles.viewMenuBtn} onPress={openPlacePage}>
              <Text style={styles.viewMenuText}>View Menu</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Locate me */}
      <Pressable
        style={[
          styles.locateBtn,
          CARD_SHADOW,
          { bottom: insets.bottom + 88 },
        ]}
        onPress={handleLocateMe}
      >
        {locationLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Feather name="crosshair" size={22} color="#fff" />
        )}
      </Pressable>

      {/* Radius picker */}
      <Modal
        visible={radiusModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setRadiusModalVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setRadiusModalVisible(false)}
        >
          <View style={[styles.radiusModal, CARD_SHADOW]}>
            <Text style={styles.radiusModalTitle}>Search radius</Text>
            {RADIUS_OPTIONS_KM.map((km) => (
              <Pressable
                key={km}
                style={[
                  styles.radiusOption,
                  radiusKm === km && styles.radiusOptionActive,
                ]}
                onPress={() => selectRadius(km)}
              >
                <Text
                  style={[
                    styles.radiusOptionText,
                    radiusKm === km && styles.radiusOptionTextActive,
                  ]}
                >
                  Within {km}km
                </Text>
                {radiusKm === km && (
                  <Feather name="check" size={18} color={PRIMARY} />
                )}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG,
  },
  headerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: BG,
    paddingHorizontal: 20,
    paddingBottom: 14,
    zIndex: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#e0d5ca",
  },
  avatarImage: {
    width: 36,
    height: 36,
  },
  brandName: {
    fontSize: 22,
    fontWeight: "700",
    color: PRIMARY,
    letterSpacing: -0.3,
    fontFamily: Platform.select({ ios: "Georgia", android: "serif" }),
  },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  radiusBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  radiusText: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: TEXT_PRIMARY,
  },
  locationHint: {
    marginTop: 10,
    paddingHorizontal: 4,
  },
  locationHintText: {
    fontSize: 12,
    color: TEXT_SECONDARY,
    textAlign: "center",
  },
  centerDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "rgba(74, 21, 27, 0.25)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  centerDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: PRIMARY,
  },
  callout: {
    position: "absolute",
    left: 20,
    right: 72,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    zIndex: 20,
  },
  calloutTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 14,
    gap: 12,
  },
  calloutTitleBlock: {
    flex: 1,
  },
  calloutName: {
    fontSize: 20,
    fontWeight: "700",
    color: PRIMARY,
    marginBottom: 4,
    fontFamily: Platform.select({ ios: "Georgia", android: "serif" }),
  },
  calloutDistance: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.8,
    color: TEXT_SECONDARY,
    textTransform: "uppercase",
  },
  ratingPill: {
    minWidth: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#FFF0F0",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#C62828",
  },
  calloutActions: {
    flexDirection: "row",
    gap: 10,
  },
  directionsBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: PRIMARY,
    borderRadius: 14,
    paddingVertical: 14,
  },
  directionsText: {
    color: PRIMARY,
    fontSize: 15,
    fontWeight: "700",
  },
  viewMenuBtn: {
    flex: 1,
    backgroundColor: PRIMARY,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  viewMenuText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  locateBtn: {
    position: "absolute",
    right: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  radiusModal: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 8,
    overflow: "hidden",
  },
  radiusModalTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: TEXT_SECONDARY,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  radiusOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  radiusOptionActive: {
    backgroundColor: "#F8F4F0",
  },
  radiusOptionText: {
    fontSize: 17,
    color: TEXT_PRIMARY,
  },
  radiusOptionTextActive: {
    fontWeight: "700",
    color: PRIMARY,
  },
});

export default function MapScreen() {
  const [screenKey, setScreenKey] = useState(0);
  return (
    <ErrorBoundary
      key={screenKey}
      fallbackTitle="Map could not load"
      onRetry={() => setScreenKey((k) => k + 1)}
    >
      <MapScreenContent />
    </ErrorBoundary>
  );
}

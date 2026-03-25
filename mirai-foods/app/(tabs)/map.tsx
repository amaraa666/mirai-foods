import { StyleSheet, FlatList, TouchableOpacity, View, ScrollView } from 'react-native'; import { Image } from 'expo-image'; import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { places, Product, Place } from '@/constants/data';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function MapScreen() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const renderProductPin = (numColumns = 2) => ({ item }: { item: Product }) => {
    const hours = Math.floor(item.expiringInHours);
    const minutes = Math.max(0, Math.round((item.expiringInHours % 1) * 60));
    return (

      <TouchableOpacity
        style={[
          styles.pinContainer,
          { width: numColumns === 2 ? '48%' : '100%', backgroundColor: Colors[colorScheme ?? 'light'].cardBackground },
        ]}
        onPress={() => router.push(`/product/${item.id}`)}
      >
        <Image source={{ uri: item.image }} style={[styles.pinImage, { width: '100%', height: 120 }]} />
        <View style={styles.pinBadgeContainer}>
          <ThemedText style={styles.pinRemaining}>Left {item.quantityLeft}</ThemedText>
          <ThemedText style={styles.pinDiscount}>{item.discountPercentage}% off</ThemedText>
        </View>
        <View style={{ paddingHorizontal: 10 , height: 110, justifyContent: 'space-between', paddingVertical: 8}}>
          <ThemedText style={styles.pinText}>{item.name}</ThemedText>
          <View style={styles.priceRow}>
            <ThemedText style={styles.originalPrice}>${item.originalPrice}</ThemedText>
            <ThemedText style={styles.discountedPrice}>${item.discountedPrice}</ThemedText>
          </View>
          <ThemedText style={[styles.mostOrderedMeta, styles.discountBadgeText]}>
            Ends in: {hours}h {minutes}m
          </ThemedText>
        </View>

      </TouchableOpacity>
    );
  }


  const initialRegion = location ? {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  } : {
    latitude: 47.918881038982406,
    longitude: 106.9175580789406,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const dataSource = selectedPlace
    ? [...selectedPlace.products].sort((a, b) => b.discountPercentage - a.discountPercentage)
    : places.flatMap((place) => place.products).sort((a, b) => b.discountPercentage - a.discountPercentage);

  const listHeader = (
    <>
      <View style={styles.headerSection}>
        <ThemedText type="title" style={styles.title}>Nearby Flash Sales</ThemedText>
        <ThemedText style={styles.subtitle}>
          Discover the best deals near you!
        </ThemedText>

        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={initialRegion}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            {places.map((place) => (
              <Marker
                key={place.id}
                coordinate={place.location}
                title={place.name}
                description={place.address}
                pinColor="#2a9d8f"
                onPress={() => setSelectedPlace(place)}
              />
            ))}
          </MapView>
        </View>

        {selectedPlace ? (
          <View style={styles.selectedPlaceSection}>
            <ThemedText type="title" style={styles.title}>{selectedPlace.name}</ThemedText>
            <ThemedText style={styles.subtitle}>{selectedPlace.address}</ThemedText>
          </View>
        ) : (
          <View style={styles.noPlaceSelected}>
            <ThemedText style={styles.subtitle}>Tap a bakery marker to see products (sorted by highest discount).</ThemedText>
          </View>
        )}
      </View>
    </>
  );

  return (
    <View style={{ flex: 1, backgroundColor: Colors[colorScheme ?? 'light'].background, paddingTop: insets.top, paddingBottom: insets.bottom, paddingLeft: insets.left, paddingRight: insets.right }}>
      <FlatList
        data={dataSource}
        renderItem={renderProductPin(2)}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={[styles.fullWidthList, { paddingBottom: insets.bottom + 160, paddingHorizontal: 16 }]}
        ListHeaderComponent={listHeader}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.light.icon,
    marginBottom: 20,
  },
  mapContainer: {
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  map: {
    flex: 1,
  },
  pinsList: {
    marginBottom: 32,
  },
  pinContainer: {
    width: '100%',
    height: 250,
    borderRadius: 14,
    padding: 0,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  pinImage: {
    width: '100%',
    height: 140,
  },
  pinBadgeContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pin: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinText: {
       fontSize: 13,
    fontWeight: "700",
    marginBottom: 2,
  },
  pinDescription: {
    fontSize: 13,
    color: '#666',
    textAlign: 'left',
    marginTop: 4,
    marginHorizontal: 12,
    marginBottom: 8,
  },
  pinDiscount: {
    color: '#d32f2f',
    fontWeight: 'bold',
    fontSize: 12,
    backgroundColor: '#ffffffcc',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  pinMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  pinMeta: {
    color: '#333',
    fontSize: 12,
    fontWeight: '600',
  },
  pinRemaining: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 11,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  priceRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  originalPrice: {
    color: '#999',
    textDecorationLine: 'line-through',
    fontSize: 12,
  },
  discountedPrice: {
    color: '#606C38',
    fontWeight: '700',
    fontSize: 14,
  },
  pinTime: {
    fontSize: 10,
    color: Colors.light.icon,
  },
  selectedPlaceSection: {
    marginTop: 16,
  },
  noPlaceSelected: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerSection: {
    paddingBottom: 16,
  },
  mostOrderedMeta: {
    fontSize: 11,
    color: "#555",
    marginTop: 1,
    lineHeight: 14,
  },
  discountBadgeText: {
    color: "#cb2b2b",
    fontWeight: "bold",
  },
  fullWidthList: {
    paddingHorizontal: 0,
  },
});



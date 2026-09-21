// import { StyleSheet, View } from 'react-native';
// import { AppHeader } from '../components/AppHeader';
// import type { TabKey } from '../components/BottomTabBar';
// import { InteractiveMap } from '../components/InteractiveMap';
// import { DEFAULT_LOCATION, colors } from '../theme';

// type Props = {
//   onNavigate: (tab: TabKey) => void;
// };

// export function MapScreen({ onNavigate }: Props) {
//   return (
//     <View style={styles.screen}>
//       <AppHeader location={DEFAULT_LOCATION} onPressBell={() => onNavigate('alerts')} />
//       <InteractiveMap />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   screen: {
//     flex: 1,
//     backgroundColor: colors.background,
//   },
// });



import { StyleSheet, View } from 'react-native';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { AppHeader } from '../components/AppHeader';
import type { TabKey } from '../components/BottomTabBar';
import { DEFAULT_COORDS, DEFAULT_LOCATION, colors } from '../theme';

type Props = {
  onNavigate: (tab: TabKey) => void;
};

export function MapScreen({ onNavigate }: Props) {
  const [userLocation, setUserLocation] = useState(DEFAULT_COORDS);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;
    let mounted = true;

    const startLocationTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== Location.PermissionStatus.GRANTED || !mounted) return;

      const current = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      if (mounted) {
        setUserLocation({
          latitude: current.coords.latitude,
          longitude: current.coords.longitude,
        });
      }

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          distanceInterval: 10,
          timeInterval: 5000,
        },
        (location) => {
          if (!mounted) return;
          setUserLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        },
      );
    };

    startLocationTracking().catch(() => undefined);

    return () => {
      mounted = false;
      subscription?.remove();
    };
  }, []);

  return (
    <View style={styles.screen}>
      <AppHeader
        location={DEFAULT_LOCATION}
        onPressBell={() => onNavigate('alerts')}
      />

      <MapView
        style={styles.map}
        showsUserLocation
        showsMyLocationButton
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker
          coordinate={{
            latitude: DEFAULT_COORDS.latitude,
            longitude: DEFAULT_COORDS.longitude,
          }}
          title="Safe Rescue Pulse"
          description="Rescue location"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  map: {
    flex: 1,
  },
});
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, Alert, StyleSheet, ActivityIndicator} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import BottomNav from './BottomNav';
import { colors, commonStyles, spacing, typography, borderRadius } from './theme';

export default function MonumentScreen({ route, navigation }) {
  const [monuments, setMonuments] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const { username } = route.params;
  const [loading, setLoading] = useState(true);

  // Same markers array as MapPage
  const markers = [
    {
      coordinate: { latitude: 40.427281343904106, longitude: -86.9140668660199 },
      icon: require('../assets/belltower.jpg'),  
      title: 'Bell Tower',
    },
    {
      coordinate: { latitude: 40.4273728685978, longitude: -86.91316931431314 },
      icon: require('../assets/walk.png'),
      title: 'WALC',
    },
    {
      coordinate: { latitude: 40.4286566476374, longitude:-86.91356232247014 },
      icon: require('../assets/efountain.jpg'),
      title: 'Engineering fountain',
    },
    {
      coordinate: { latitude: 40.4312239799775, longitude: -86.91588249175554 },
      icon: require('../assets/neil.png'),  
      title: 'Neil statue',
    },
    {
      coordinate: { latitude: 40.4250502093892, longitude: -86.91111546181843 },
      icon: require('../assets/pmu.png'),
      title: 'PMU',
    }
  ];

  // Distance calculation function (Haversine formula)
  const getDistance = (coords1, coords2) => {
    const R = 6371; // Radius of Earth in km
    const dLat = degreesToRadians(coords2.latitude - coords1.latitude);
    const dLon = degreesToRadians(coords2.longitude - coords1.longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(degreesToRadians(coords1.latitude)) *
        Math.cos(degreesToRadians(coords2.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const degreesToRadians = (degrees) => {
    return degrees * (Math.PI / 180);
  };

  // Calculate nearby monuments
  const calculateNearbyMonuments = (userLoc) => {
    const markersWithDistances = markers.map(marker => ({
      ...marker,
      distance: getDistance(userLoc, marker.coordinate)
    }));

    const closest = markersWithDistances
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);

    setMonuments(closest);
  };

  useEffect(() => {
    const initializeLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required');
        return;
      }

      try {
        // Try to get passed markers and location first
        const passedMarkers = route.params?.closestMarkers;
        const passedLocation = route.params?.userLocation;

        if (passedMarkers && passedLocation) {
            setMonuments(passedMarkers);
            setUserLocation(passedLocation);
        } else {
          // If no passed data, calculate everything
          let location = await Location.getCurrentPositionAsync({});
          setUserLocation(location.coords);
          calculateNearbyMonuments(location.coords);
        }
      } catch (error) {
        console.error('Error initializing:', error);
        // Handle error case by getting current location
        let location = await Location.getCurrentPositionAsync({});
        setUserLocation(location.coords);
        calculateNearbyMonuments(location.coords);
        
      }
      setLoading(false);
    };
    initializeLocation();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={[commonStyles.safeArea, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading nearby monuments...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <Text style={styles.header}>Nearby Monuments</Text>
      
      <FlatList
        data={monuments}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={item.icon} style={styles.icon} />
            <View style={styles.infoContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.distance}>
                Distance: {(item.distance * 1000).toFixed(0)}m away
              </Text>
            </View>
          </View>
        )}
      />

      {/* Bottom Navigation Bar */}
      <BottomNav 
        route={route}
        navigation={navigation} 
        username={username}
        currentScreen={"Monument"}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.textPrimary,
    fontSize: typography.sizes.md,
    marginTop: spacing.md,
  },
  header: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    textAlign: 'center',
    marginVertical: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  icon: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.sm,
    marginRight: spacing.md,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  distance: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
  }
});
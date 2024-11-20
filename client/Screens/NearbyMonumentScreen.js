import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import BottomNav from './BottomNav';
import { useFocusEffect } from '@react-navigation/native';
import { colors, commonStyles, spacing, typography, borderRadius } from './theme';
import axios from 'axios';
import Config from '../config';

export default function MonumentScreen({ route, navigation }) {
  const [monuments, setMonuments] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const { username } = route.params;
  const [loading, setLoading] = useState(true);

  const fetchUserLocation = async () => {
    try {
      console.log("Requesting location permissions...");
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required');
        return null;
      }

      console.log("Fetching user location...");
      const location = await Location.getCurrentPositionAsync({});
      if (location && location.coords) {
        console.log("User location fetched successfully:", location.coords);
        return location.coords;
      } else {
        console.warn("No coordinates returned from location.");
        return null;
      }
    } catch (error) {
      console.error('Error fetching user location:', error);
      return null;
    }
  };

  const fetchMonuments = async (currentLocation) => {
    try {
      const response = await axios.get(`${Config.API_URL}/monument`);
      const fetchedMonuments = response.data;
      console.log("Fetched Monuments from Backend:", fetchedMonuments);

      const formattedMonuments = fetchedMonuments.map(monument => {
        const latitude = monument.location.coordinates[1];
        const longitude = monument.location.coordinates[0];

        return {
          ...monument,
          coordinate: { latitude, longitude },
          distance: currentLocation
            ? getDistance(currentLocation, { latitude, longitude })
            : null,
        };
      });

      const sortedMonuments = formattedMonuments.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
      setMonuments(sortedMonuments);
    } catch (error) {
      console.error('Error fetching monuments:', error);
      Alert.alert('Error', 'Failed to fetch monuments. Please try again later.');
    }
  };

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

  const getImageSource = (iconPath) => {
    switch (iconPath) {
      case '../assets/belltower.jpg':
        return require('../assets/belltower.jpg');
      case '../assets/walk.png':
        return require('../assets/walk.png');
      case '../assets/efountain.jpg':
        return require('../assets/efountain.jpg');
      case '../assets/purduepete.png':
        return require('../assets/purduepete.png');
      case '../assets/neil.png':
        return require('../assets/neil.png');
      case '../assets/pmu.png':
        return require('../assets/pmu.png');
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const initializeData = async () => {
        setLoading(true);
        const location = await fetchUserLocation();
        if (location) {
          setUserLocation(location);
          await fetchMonuments(location);
        } else {
          await fetchMonuments(null); // Fetch monuments without distance if location is unavailable
        }
        fetchWishlist(username);
        setLoading(false);
      };

      initializeData();
    }, [])
  );

    const fetchWishlist = async (username) => {
      try {
        const response = await axios.get(`${Config.API_URL}/user/${username}/wishlist`);
        console.log('Wishlist:', response.data);
        setWishlist(response.data);
      } catch (error) {
        console.error('Error fetching wishlist:', error.response?.data || error.message);
      }
    };

  const addToWishlist = async (monument) => {
    try {
      const response = await axios.post(`${Config.API_URL}/user/wishlist`, {
        username,
        monument,
      });

      Alert.alert('Success', `${monument.title} added to your wishlist.`);
      setWishlist(prev => [...prev, monument._id]); // Update local wishlist
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
  };

  const removeFromWishlist = async (monument) => {
    try {
      const response = await axios.post(`${Config.API_URL}/user/wishlist/remove`, {
        username,
        monument: monument._id,
      });
  
      Alert.alert('Success', `${monument.title} removed from your wishlist.`);
      setWishlist(prev => prev.filter(id => id !== monument._id)); // Update local wishlist
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
  };

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
        renderItem={({ item }) => {
          const isInWishlist = wishlist.includes(item._id);
          return (
            <View style={styles.card}>
              <Image source={ getImageSource(item.icon) } style={styles.icon} />
              <View style={styles.infoContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.distance}>
                  Distance: {item.distance ? `${(item.distance * 1000).toFixed(0)}m away` : 'Unknown'}
                </Text>
              </View>
              <TouchableOpacity
                style={isInWishlist ? styles.inWishlistButton : styles.wishlistButton}
                onPress={() => {
                  if (isInWishlist) {
                    removeFromWishlist(item); // Remove if already in wishlist
                  } else {
                    addToWishlist(item); // Add if not in wishlist
                  }
                }}
              >
                <Text style={styles.wishlistButtonText}>
                  {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
      <BottomNav route={route} navigation={navigation} username={username} currentScreen={"Monument"} />
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
  },
  wishlistButton: {
    backgroundColor: colors.border, // Similar to the follow button
    paddingVertical: 6, // Same padding as followButton
    paddingHorizontal: 10, // Same horizontal padding as followButton
    borderRadius: 5, // Rounded edges
    alignItems: 'right', // Center text horizontally
    justifyContent: 'right', // Center text vertically
    marginLeft: 1, // Slight margin for separation
    marginRight: 4, // Align neatly to the right within the card
  },
  inWishlistButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  wishlistButtonText: {
    color: '#FFFFFF', // White text for contrast
    fontWeight: 'bold', // Bold text for emphasis
  },
});
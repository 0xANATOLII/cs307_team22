import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, Alert, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles';

export default function MonumentScreen({ route, navigation }) {
  const [monuments, setMonuments] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const { username } = route.params;
 // const [isWithinRadius, setIsWithinRadius] = useState(false);  USE FOR BADGE
  const RADIUS_THRESHOLD = 0.01; // 10 meters in kilometers USE FOR BADGE

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

  // Check if user is within radius of any monument
  //CODE FOR DETECTING BADGE PROXIMITY
  /*
  const checkProximity = (userLoc) => {
    const isNear = monuments.some(monument => {
      const distance = getDistance(userLoc, monument.coordinate);
      return distance <= RADIUS_THRESHOLD;
    });
    setIsWithinRadius(isNear);
    
    if (!isNear) {
      Alert.alert(
        "Too Far",
        "You're not within range of any monuments. Please move closer or refresh the page.",
        [
          { 
            text: "Refresh", 
            onPress: () => calculateNearbyMonuments(userLoc)
          },
          {
            text: "OK",
            style: "cancel"
          }
        ]
      );
    }
  };
  */

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

        let location = await Location.getCurrentPositionAsync({});
        if (passedMarkers && passedLocation) {
          const distance = getDistance(location, passedLocation);
          if(distance <= RADIUS_THRESHOLD) {
            setMonuments(passedMarkers);
            setUserLocation(passedLocation);
          }
          else {
            // If old data is passed, calculate everything
            setUserLocation(location.coords);
            calculateNearbyMonuments(location.coords);
          }
        } else {
          // If no passed data, calculate everything
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
    };

    initializeLocation();
  }, []);
 
  const navigateToScreen = (screenName) => {
    navigation.navigate(screenName, { username });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.monumentHeader}>
        Nearby Monuments 
      </Text>
      
      <FlatList
        data={monuments}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={[
            styles.monumentCard,styles.monumentCardInactive
          ]}>
            <Image source={item.icon} style={styles.monumentIcon} />
            <View style={styles.monumentInfo}>
              <Text style={styles.monumentTitle}>{item.title}</Text>
              <Text style={styles.monumentDistance}>
                Distance: {(item.distance * 1000).toFixed(0)}m away
              </Text>
            </View>
          </View>
        )}
      />

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <Pressable 
          style={styles.navItem} 
          onPress={() => navigateToScreen('Map')}
        >
          <MaterialIcons name="map" size={28} color="#666" />
          <Text style={styles.navText}>Map</Text>
        </Pressable>

        <Pressable 
          style={styles.navItem} 
          onPress={() => navigateToScreen('Monument')}
        >
          <MaterialIcons name="star" size={28} color="#007AFF" />
          <Text style={[styles.navText,styles.navTextActive]}>Monument</Text>
        </Pressable>

        <Pressable 
          style={styles.navItem} 
          onPress={() => navigateToScreen('BadgeFeed')}
        >
          <MaterialIcons name="chat" size={28} color="#666" />
          <Text style={styles.navText}>BadgeFeed</Text>
        </Pressable>

        <Pressable 
          style={styles.navItem} 
          onPress={() => navigateToScreen('Profile')}
        >
          <MaterialIcons name="person" size={28} color="#666" />
          <Text style={styles.navText}>Profile</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}


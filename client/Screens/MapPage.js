// components/MapPage.js
import React, { useState, useEffect } from 'react';
import { Pressable, View, Text, Image} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; //Import NavBar Icons
import ModalPopup from './Profile/Popup';
import styles from '../styles'; 

export default function MapPage({ route, navigation }) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [min,setMin] = useState(-1);
  const [closestMarker, setClosestMarker] = useState(null);
  const [closestMarkers, setClosestMarkers] = useState([]);
  const markers = [
    {
      coordinate: { latitude: 40.427281343904106, longitude: -86.9140668660199 },
      icon: require('../assets/belltower.jpg'),  
      title: 'Bell Tower',
    },
    {
      coordinate: { latitude: 40.4273728685978, longitude: -86.91316931431314 },
      icon: require('../assets/walk.png'),  // Another local image
      title: 'WALC',
    },
    {
      coordinate: { latitude: 40.4286566476374, longitude:-86.91356232247014 },
      icon: require('../assets/efountain.jpg'),  // Another local image
      title: 'Engineering fountain',
    },
    {
      coordinate: { latitude: 40.4312239799775, longitude: -86.91588249175554 },
      icon: require('../assets/neil.png'),  
      title: 'Neil statue',
    },
    {
      coordinate: { latitude: 40.4250502093892, longitude: -86.91111546181843 },
      icon: require('../assets/pmu.png'),  // Another local image
      title: 'PMU',
    }
  ];
  
  useEffect(() => {
    (async () => {
      // Ask for location permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      // Get the current location
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);


    })();
  }, []);

  const { username } = route.params;
  const navigateToScreen = (screenName) => {
    // If navigating to Monument screen, pass the closestMarkers
    if (screenName === 'Monument') {
      navigation.navigate(screenName, { 
        username: username,
        closestMarkers: closestMarkers,
        userLocation: location.coords // Optionally pass user location too
      });
    } else {
      // For other screens, keep the original navigation
      navigation.navigate(screenName, { username: route.params.username });
    }
  };

  useEffect(() => {
    if (location) {
      const closest = markers.reduce((prev, curr) => {
        const prevDistance = getDistance(location.coords, prev.coordinate);
        const currDistance = getDistance(location.coords, curr.coordinate);
        return prevDistance < currDistance ? prev : curr;
      }, markers[0]);

      // Find the closest marker
      setClosestMarker(closest);
    }
  }, [location]);

  useEffect(() => {
    if (location) {
      // Find the 3 closest markers out of all markers (MODIFY)
      let markersWithDistances = markers.map(marker => ({
        ...marker,
        distance: getDistance(location.coords, marker.coordinate)
      }));

      // Sort by distance and take top 3
      markersWithDistances = markersWithDistances.sort((a, b) => a.distance - b.distance).slice(0, 3);
      setClosestMarkers(markersWithDistances);

      const closest = markersWithDistances[0];
      setClosestMarker(closest);
    }
  }, [location]);
 
  
  const getDistance = (coords1, coords2) => {
    // Calculate distance using Haversine formula or any preferred method
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

  // Display an error message if location permission is denied
  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text>{errorMsg}</Text>
      </View>
    );
  }

  // Render a loading message until the location is obtained
  if (!location) {
    console.log("Loading")
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
   
  }

  // Once location is available, render the map centered on the user's location
  return (
    <SafeAreaView style={styles.safeArea}>
      {/*Map Section*/}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >

          <Marker coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
           title="Your Location">
            <Image
              source={require('../assets/user-icon.png')} // Custom user location icon
              style={{ width: 30, height: 30 }}
            />
          </Marker>
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.coordinate}
            title={marker.title}
          >
            
            <Image source={marker.icon} style={closestMarker && closestMarker.title === marker.title ? { width: 30, height: 30, backgroundColor:'white'} : { width: 30, height: 30}} />
          </Marker>
        ))}

      </MapView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <Pressable 
          style={styles.navItem} 
          onPress={() => navigateToScreen('Map')}
        >
          <MaterialIcons name="map" size={28} color="#007AFF" />
          <Text style={[styles.navText,styles.navTextActive]}>Map</Text>
        </Pressable>

        <Pressable 
          style={styles.navItem} 
          onPress={() => navigateToScreen('Monument')}
        >
          <MaterialIcons name="star" size={28} color="#666" />
          <Text style={styles.navText}>Monument</Text>
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
};

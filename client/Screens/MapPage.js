import React, { useState, useEffect, useContext } from 'react';
import { View, Image, Text,TouchableOpacity, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import styles from '../styles'; 
import { MaterialIcons } from '@expo/vector-icons';
import { LocationContext } from './Components/locationContext';



export default function MapPage({
  isMiniMap = false,  // Control if this is a mini map or full map
  mapHeight = 200,    // Height of the map
  mapWidth = '100%',  // Width of the map
  zoomEnabled = true, // Control zooming
  scrollEnabled = true // Control scrolling
}) {
  //const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [closestMarker, setClosestMarker] = useState(null);

  const { closestMon, location, setClosestMon, setLocation} = useContext(LocationContext)

  
  const markers = [
    { coordinate: { latitude: 40.427281343904106, longitude: -86.9140668660199 }, icon: require('../assets/belltower.jpg'), title: 'Bell Tower' },
    { coordinate: { latitude: 40.4273728685978, longitude: -86.91316931431314 }, icon: require('../assets/walk.png'), title: 'WALC' },
    { coordinate: { latitude: 40.4286566476374, longitude: -86.91356232247014 }, icon: require('../assets/efountain.jpg'), title: 'Engineering fountain' },
    { coordinate: { latitude: 40.4312239799775, longitude: -86.91588249175554 }, icon: require('../assets/neil.png'), title: 'Neil statue' },
    { coordinate: { latitude: 40.4250502093892, longitude: -86.91111546181843 }, icon: require('../assets/pmu.png'), title: 'PMU' }
  ];

  // Request location permission and fetch current location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    })();
  }, []);

  // Compute closest marker when location is available
  useEffect(() => {
    if (location) {
      const closest = markers.reduce((prev, curr) => {
        const prevDistance = getDistance(location.coords, prev.coordinate);
        const currDistance = getDistance(location.coords, curr.coordinate);
        return prevDistance < currDistance ? prev : curr;
      }, markers[0]);

      setClosestMarker(closest);
      setClosestMon(closest.title)
    }
  }, [location]);

  const getDistance = (coords1, coords2) => {
    const R = 6371; // Radius of Earth in km
    const dLat = degreesToRadians(coords2.latitude - coords1.latitude);
    const dLon = degreesToRadians(coords2.longitude - coords1.longitude);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(degreesToRadians(coords1.latitude)) *
              Math.cos(degreesToRadians(coords2.latitude)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const degreesToRadians = (degrees) => degrees * (Math.PI / 180);

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text>{errorMsg}</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[
      isMiniMap 
        ? { height: mapHeight, width: mapWidth, borderRadius: 15, overflow: 'hidden' } 
        : styles.map
    ]}>

      <TouchableOpacity style={styles_btn.topRightButton} onPress={() => alert('Right Button Pressed')}>
       
       <Text>Back</Text>

      {/* <MaterialIcons name="more-vert" size={24} color="red" />*/}
      </TouchableOpacity>
   
      
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: isMiniMap ? 0.005 : 0.0922,  // More zoomed-in for mini map
          longitudeDelta: isMiniMap ? 0.005 : 0.0421,
        }}
        zoomEnabled={zoomEnabled}
        scrollEnabled={scrollEnabled}
      >
        <Marker coordinate={{ latitude: location.coords.latitude, longitude: location.coords.longitude }} title="Your Location">
          <Image source={require('../assets/user-icon.png')} style={{ width: 30, height: 30 }} />
        </Marker>

        {markers.map((marker, index) => (
          <Marker key={index} coordinate={marker.coordinate} title={marker.title}>
            <Image source={marker.icon} style={closestMarker && closestMarker.title === marker.title ? { width: 30, height: 30, backgroundColor: 'red' } : { width: 30, height: 30 }} />
          </Marker>
        ))}
      </MapView>
      {isMiniMap && closestMarker && (
  <Text>{closestMarker.title}</Text>
)}

    </View>
  );
}


const styles_btn = StyleSheet.create({
topRightButton: {
  position: 'absolute',
  top: 40,
  right: 20,
  padding: 10,
  backgroundColor: '#007AFF',
  borderRadius: 20,
},
});
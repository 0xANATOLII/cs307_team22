// components/MapPage.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
const MapPage = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

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
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Once location is available, render the map centered on the user's location
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
<Marker
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
        >
          {/* Custom icon as a child of the Marker */}
          <Image 
        source={require('../assets/user-icon.png')}
        style={{ width: 40, height: 40 }}
      />
        </Marker>

        {markers.map((marker, index) => (
          <Marker key={index} coordinate={marker.coordinate} title={marker.title}>
            <Image source={marker.icon} style={{ width: 20, height: 20 }} />
          </Marker>
        ))}

      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default MapPage;

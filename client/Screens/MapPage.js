import React, { useState, useEffect, useContext } from 'react';
import { View, Image, Alert, Text,TouchableOpacity, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { SafeAreaFrameContext, SafeAreaView } from 'react-native-safe-area-context';
import BottomNav from './BottomNav';
import Config from "../config.js";
import styles from '../styles'; 
import { MaterialIcons } from '@expo/vector-icons';
import { LocationContext } from './Components/locationContext';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function MapPage({
  isMiniMap = false,  // Control if this is a mini map or full map
  mapHeight = 200,    // Height of the map
  mapWidth = '100%',  // Width of the map
  zoomEnabled = true, // Control zooming
  scrollEnabled = true,  // Control scrolling
   route, navigation 
}) {
  const defaultImageUri = Image.resolveAssetSource(require('./Profile/default.png')).uri;

  const [loading, setLoading] = useState(true);

  const [profileInfo, setProfileInfo] = useState({
    username: username,
    pfp: null 
  });
  useFocusEffect(
    useCallback(() => {
      const fetchProfileData = async () => {
        try {
          const response = await fetch(`${Config.API_URL}/user/profile/${username}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
  
          if (response.ok) {
            const data = await response.json();
            //console.log(data);
            setProfileInfo({
              userId: data._id,
              username: data.username,
              privacy: data.privacy,
              pfp: data.pfp || defaultImageUri,
            });
          } else {
            Alert.alert('Error', 'Failed to load profile data.');
          }
        } catch (error) {
          Alert.alert('Error', 'Unable to fetch profile data.');
          console.log(error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchProfileData();
  
      // Optional cleanup function if needed
      return () => {
        setLoading(true); // Reset loading state if necessary
      };
    }, [username]) // Add username to the dependency array if it can change
  );
  //const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const { closestMon, location, setClosestMon, setLocation} = useContext(LocationContext)

  
  const markers = [
    { coordinate: { latitude: 40.427281343904106, longitude: -86.9140668660199 }, icon: require('../assets/belltower.jpg'), title: 'Bell Tower' },
    { coordinate: { latitude: 40.4273728685978, longitude: -86.91316931431314 }, icon: require('../assets/walk.png'), title: 'WALC' },
    { coordinate: { latitude: 40.4286566476374, longitude: -86.91356232247014 }, icon: require('../assets/efountain.jpg'), title: 'Engineering fountain' },
    { coordinate: { latitude: 40.4312239799775, longitude: -86.91588249175554 }, icon: require('../assets/neil.png'), title: 'Neil statue' },
    { coordinate: { latitude: 40.4250502093892, longitude: -86.91111546181843 }, icon: require('../assets/pmu.png'), title: 'PMU' },
    { coordinate: { latitude: 40.42914198367059, longitude: -86.90702203252353 }, icon: require('../assets/purduepete.png'), title: 'Lutz House' }
  ];

  // Request location permission and fetch current location

  const [min,setMin] = useState(-1);
  const [closestMarker, setClosestMarker] = useState(null);
  const [closestMarkers, setClosestMarkers] = useState([]);
  const [isWithinRadius, setIsWithinRadius] = useState(false);
  const [isPromptVisible, setIsPromptVisible] = useState(false); 
  const RADIUS_THRESHOLD = 0.03; //100 meters 
  

  useEffect(() => {
    let proximityInterval = null;
  
    const startLocationChecks = async () => {
      try {
        // Ask for location permissions once
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }
  
        // Get initial location
        let currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.BestForNavigation
        });
        setLocation(currentLocation);
  
        // Set up regular location checks
        proximityInterval = setInterval(async () => {
          try {
            // Get updated location
            const newLocation = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.BestForNavigation
            });
            setLocation(newLocation);
          } catch (error) {
            console.error("Error getting location:", error);
          }
        }, 3000); // Check every 10 seconds
  
      } catch (error) {
        console.error("Error setting up location checks:", error);
        setErrorMsg('Error setting up location tracking');
      }
    };
  
    startLocationChecks();
  
    // Cleanup function
    return () => {
      if (proximityInterval) {
        clearInterval(proximityInterval);
      }
    };
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
      setClosestMon(closest.title)
    }
  }, [location]);

  const getDistance = (coords1, coords2) => {

    // Calculate distance using Haversine formula or any preferred method

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

  const degreesToRadians = (degrees) => {
    return degrees * (Math.PI / 180);
  };

  // Check if user is within radius of any monument
  //CODE FOR DETECTING BADGE PROXIMITY
  const checkProximity = (userLoc,monument) => {
    if (isPromptVisible || isMiniMap) {
      return;
    }
  
    const distance = getDistance(userLoc, monument.coordinate);
    if (distance > RADIUS_THRESHOLD) {
      Alert.alert(
        "Not Close Enough :(",
        `You need to be within 30 meters of ${monument.title}. Refer to the Monument Page for distances`,
        [
          {
            text: "Ok",
            onPress: () => {
              setIsPromptVisible(false); // Reset after user responds
            },
            style: "cancel"
          }
        ],
        {
          onDismiss: () => {
            setIsPromptVisible(false); 
          }
        }
      );
      return;
    }

    setIsPromptVisible(true);
    Alert.alert(
      "You can earn a Badge!",
      `You're within range of ${monument.title}. Do you want to create a badge or cancel?`,
      [
        { 
          text: "Create Badge", 
          onPress: () => {
            navigation.navigate("CameraRoll", { username: route.params.username });
            setIsPromptVisible(false);
          }
        },
        {
          text: "Cancel",
          onPress: () => {
            setIsPromptVisible(false); // Reset after user responds
          },
          style: "cancel"
        }
      ],
      {
        onDismiss: () => {
          setIsPromptVisible(false); 
        }
      }
    );

  };

  // Display an error message if location permission is denied

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


    <View 
    
    style={[
      isMiniMap 
        ? { height: mapHeight, width:"100%" ,borderRadius: 15, overflow: 'hidden' } 
        : styles.safeArea
    ]}
    > 


        <TouchableOpacity style={styles_btn.topRightButton} onPress={() => alert('Right Button Pressed')}>      
        <Text>Back</Text>
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
            <Image
              source={
                profileInfo.pfp
                  ? { uri: profileInfo.pfp }  // Base64 or remote URL
                  : { uri: defaultImageUri }  // Local fallback URI
              }
              style={styles.mapProfilePhoto}
            />
          </Marker>

          {markers.map((marker, index) => (
            <Marker key={index} coordinate={marker.coordinate} title={marker.title}>
              <TouchableOpacity onPress={() => checkProximity(location.coords,marker)}>
                <Image source={marker.icon} style={closestMarker && closestMarker.title === marker.title ? { width: 30, height: 30, backgroundColor: 'red' } : { width: 30, height: 30 }} />
              </TouchableOpacity>
            </Marker>
          ))}
        </MapView>
        {isMiniMap && closestMarker && (<Text>{closestMarker.title}</Text>)}

   

      {/* Bottom Navigation Bar */}

 {!isMiniMap && (
  <BottomNav 
  route={route}
  navigation={navigation} 
  username={username}
  closestMarkers={closestMarkers}
  userLocation={location.coords}
  currentScreen={"Map"}
/>
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
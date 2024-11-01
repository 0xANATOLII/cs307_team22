import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles';

const BottomNav = ({ navigation, route, closestMarkers, userLocation, currentScreen}) => {
  // Track the active screen to style it
  const { username } = route.params;
  const navigateToScreen = (screenName) => {
    navigation.navigate(screenName, { 
      username, 
      closestMarkers, 
      userLocation 
    });
  };

  // Array of navigation items
  const navItems = [
    { screen: 'CameraRoll', label: 'Camera', icon: 'camera' },
    { screen: 'BadgeFeed', label: 'Badges', icon: 'chat' },
    { screen: 'Monument', label: 'Monuments', icon: 'star' },
    { screen: 'Map', label: 'Map', icon: 'map' },
    { screen: 'Friends', label: 'Friends', icon: 'people' },
    { screen: 'Profile', label: 'Profile', icon: 'person' },
  ];

  return (
    <View style={[styles.bottomNav, { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }]}>
      {navItems.map((item, index) => (
        <Pressable 
          key={index} 
          style={[styles.navItem, { alignItems: 'center' }]} 
          onPress={() => navigateToScreen(item.screen)}
        >
          <MaterialIcons 
            name={item.icon} 
            size={28} 
            color={currentScreen === item.screen ? '#007AFF' : '#666'} 
          />
          <Text style={[styles.navText, currentScreen === item.screen && styles.navTextActive]}>
            {item.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

export default BottomNav;

// screens/NearbyMonumentScreen.js
import React, { useState, useEffect } from 'react';
import {View, Text, Pressable, SafeAreaView,TextInput} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; //Import NavBar Icons
import styles from '../styles'; 

export default function NearbyMonumentScreen({ route, navigation }) {
  const { username } = route.params;

  const navigateToScreen = (screenName) => {
    navigation.navigate(screenName, { username });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
      <Text style={styles.title}>Monument Screen (IN PROGRESS)</Text>
      </View>

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


// screens/NearbyMonumentScreen.js
import React, { useState, useEffect } from 'react';
import {View, Text, Pressable, SafeAreaView,TextInput} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; //Import NavBar Icons
import styles from '../styles'; 

export default function NearbyMonumentScreen({ route, navigation }) {
  const { username } = route.params;
  useEffect(() => {
    // Hide the default header
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const navigateToScreen = (screenName) => {
    navigation.navigate(screenName, { username });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
      />
      <Pressable 
        style={({ pressed }) => [
          styles.button,
          pressed && { backgroundColor: '#555' } // Change background color when pressed
        ]}
      >
        <Text style={styles.buttonText}>Register</Text>
      </Pressable>
      </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <Pressable 
          style={styles.navItem} 
          onPress={() => navigateToScreen('Home')}
        >
          <MaterialIcons name="home" size={28} color="#666" />
          <Text style={styles.navText}>Home</Text>
        </Pressable>

        <Pressable 
          style={styles.navItem} 
          onPress={() => navigateToScreen('Search')}
        >
          <MaterialIcons name="star" size={28} color="#007AFF" />
          <Text style={[styles.navText,styles.navTextActive]}>Monument</Text>
        </Pressable>

        <Pressable 
          style={styles.navItem} 
          onPress={() => navigateToScreen('Messages')}
        >
          <MaterialIcons name="chat" size={28} color="#666" />
          <Text style={styles.navText}>Messages</Text>
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


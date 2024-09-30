// screens/HomePage.js
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import styles from '../styles'; 

export default function HomePage({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.button}>
        <Pressable 
          title="Login" 
          onPress={() => navigation.navigate('Login')}
          style={({ pressed }) => [
            styles.button,
            pressed && { backgroundColor: '#555' } // Change background color when pressed
          ]}
        >
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
      </View>
      <View style={styles.button}>
      <Pressable
          onPress={() => navigation.navigate('Registration')}
          style={({ pressed }) => [
            styles.button,
            pressed && { backgroundColor: '#555' }
          ]}
        >
          <Text style={styles.buttonText}>Register</Text>
        </Pressable>
      </View>
    </View>
  );
}

// screens/HomePage.js
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Image, ScrollView } from 'react-native';
import styles from '../styles'; 

export default function HomePage({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Basic form validation can go here
    console.log("Logging in with:", username, password);
    //Temporary navigation to profile screen (used to view UI)
    navigation.navigate('Profile')
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BeBoiler</Text>
      <Image 
        source={require('../assets/purduepete.png')}
        style={styles.logo}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={styles.button}>
      <Pressable 
        onPress={handleLogin}
        style={({ pressed }) => [
          styles.button,
          pressed && { backgroundColor: '#555' }
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
      <View style={styles.button}>
        <Pressable
          onPress={() => navigation.navigate('Forgot Password')}
          style={({ pressed }) => [
            styles.button,
            pressed && { backgroundColor: '#555' }
          ]}
        >
          <Text style={styles.buttonText}>Forgot Password?</Text>
        </Pressable>
      </View>
    </View>
  );
}

// screens/HomePage.js
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Image, ScrollView } from 'react-native';
import styles from '../styles'; 

export default function HomePage({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      alert('Please enter both username and password');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Login Successful');
        // Proceed to next screen or store user session, etc.
        navigation.navigate('BeBoiler', { username });
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      alert('Login Failed: ' + error.message);
    }
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
          onPress={() => navigation.navigate('ForgotPassword')}
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

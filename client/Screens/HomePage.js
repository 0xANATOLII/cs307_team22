// screens/HomePage.js
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Image } from 'react-native';
import styles from '../styles'; 
import Config from "../config.js";
import LoadingVideo from '../components/LoadingVideo';

export default function HomePage({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      alert('Please enter both username and password');
      return;
    }

    setIsLoading(true);
  };

  const handleVideoComplete = async () => {
    try {
      const response = await fetch(`${Config.API_URL}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        navigation.navigate('Map', { username });
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      alert('Login Failed: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LoadingVideo 
        isLoading={isLoading} 
        onLoadingComplete={handleVideoComplete}
      />
      {!isLoading && (
        <>
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
          <View style={styles.button}>
            <Pressable
              onPress={() => navigation.navigate('BadgePage',{acusername:"tolik",acbadgeId:"6733d11184a3595f9b53efec"})}
              style={({ pressed }) => [
                styles.button,
                pressed && { backgroundColor: '#555' }
              ]}
            >
              <Text style={styles.buttonText}>BadgePage</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

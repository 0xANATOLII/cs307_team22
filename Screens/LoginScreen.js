// screens/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import styles from '../styles'; 

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Basic form validation can go here
    console.log("Logging in with:", username, password);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
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
  );
}

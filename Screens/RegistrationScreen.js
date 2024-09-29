// screens/RegistrationScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import styles from '../styles'; 

export default function RegistrationScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // Simple email regex pattern
    return re.test(email);
  };

  const handleRegister = async () => {
    // Check if passwords match
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    //Check if valid email
    if (!validateEmail(email)) {
      alert("Invalid email format!");
      return;
    }
    // Basic form validation can go here
    console.log("Registering with:", username, password, email);
    //try {
    //  const response = await registerUser(username, email, password);
    //  if (response.success) {
    //    alert('Registration Successful');
    //    navigation.navigate('Login'); // Redirect to login screen
    //  }
    //}  catch (error) {
    //  alert('Registration Failed', error.message);
    //}
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <Pressable 
        onPress={handleRegister}
        style={({ pressed }) => [
          styles.button,
          pressed && { backgroundColor: '#555' } // Change background color when pressed
        ]}
      >
        <Text style={styles.buttonText}>Register</Text>
      </Pressable>
    </View>
  );
}


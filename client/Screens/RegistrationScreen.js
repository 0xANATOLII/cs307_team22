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
    try {
      // send payload to backend
      const payload = {
        username: username,
        email: email,
        password: password,
      };
    const response = await fetch('https://0fc9-128-210-106-68.ngrok-free.app/user/signup', {
      method: 'POST',  
      headers: {
        'Content-Type': 'application/json',  
      },
      body: JSON.stringify(payload),  // Convert the payload object to a JSON string
    });

    const data = await response.json();  // Parse the response as JSON

    // Check if the registration was successful
    if (response.ok) {
      alert('Registration Successful');
      // Redirect or navigate to another screen (e.g., Login screen)
      // navigation.navigate('Login');
    } else {
      // Handle the error (data may contain error messages from the server)
      alert('Registration Failed: ' + data.message || 'Unknown error');
    }
  } catch (error) {
    // Handle any network or other errors
    alert('Registration Failed: ' + error.message);
  }
    
    // Basic form validation can go here
    // console.log("Registering with:", username, password, email);
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


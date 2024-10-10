// screens/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import styles from '../styles'; 

export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState('');

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // Simple email regex pattern
        return re.test(email);
      };

    const handleReset = async () => {
        // Basic form validation can go here
        if (!validateEmail(email)) {
            alert("Invalid email format!");
            return;
          }
        console.log("Email Recieved", email);
        try {
          const response = await fetch('http://localhost:3000/user/requestPasswordReset', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
          });
    
          const data = await response.json();
    
          if (response.ok) {
            Alert.alert("Success", "Check your email for password reset instructions.");
          } else {
            Alert.alert("Error", data.message || "Failed to send reset email.");
          }
        } catch (error) {
          Alert.alert("Error", "An error occurred while requesting a password reset.");
        }
      };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset your password</Text>
      <Text style={styles.text}>Please enter your email address. We will send you an email to reset your password.</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <View style={styles.button}>
      <Pressable 
        onPress={handleReset}
        style={({ pressed }) => [
          styles.button,
          pressed && { backgroundColor: '#555' }
        ]}
      >
        <Text style={styles.buttonText}>Send Email</Text>
      </Pressable>
      </View>
    </View>
  );
}

// screens/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import styles from '../styles'; 
import Config from "../config.js";

export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState('');

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // Simple email regex pattern
        return re.test(email);
      };

    //FIX THIS AND ADD TO PROFILE HISTORY
    const updateHistory = async () => {
      try {
        const response = await fetch(`${Config.API_URL}/user/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        });
    
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
    
        const data = await response.json();
        console.log('User updated successfully:', data);
      } catch (error) {
        console.error('Error updating user:', error);
      }
    };
    

    const handleReset = async () => {
        // Basic form validation can go here
        if (!validateEmail(email)) {
            alert("Invalid email format!");
            return;
          }
        console.log("Email Recieved", email);
        try {
          const response = await fetch(`${Config.API_URL}/user/requestPasswordReset`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
          });
    
          const data = await response.json();
    
          if (response.ok) {
            console.log(response.ok);
            console.log("Email sent", email);
            setTimeout(() => {
              alert("Check your email for password reset instructions.");
          }, 0);
          } else {
            alert(data.message || "Failed to send reset email.");
          }
        } catch (error) {
            alert("An error occurred while requesting a password reset.");
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

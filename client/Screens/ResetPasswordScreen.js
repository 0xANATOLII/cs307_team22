import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import styles from '../styles';

export default function ResetPasswordScreen({ route, navigation }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Extract the token from the URL (or route parameters)
  const token = route.params?.token;

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in both fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/user/resetPassword', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Your password has been reset successfully.");
        navigation.navigate('Home');
      } else {
        Alert.alert("Error", data.message || "Failed to reset password.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Your Password</Text>
      <Text style={styles.text}>Enter a new password to reset your account.</Text>

      <TextInput
        style={styles.input}
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <View style={styles.button}>
        <Pressable 
          onPress={handleResetPassword}
          style={({ pressed }) => [
            styles.button,
            pressed && { backgroundColor: '#555' }
          ]}
        >
          <Text style={styles.buttonText}>Reset Password</Text>
        </Pressable>
      </View>
    </View>
  );
}

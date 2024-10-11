// screens/RegistrationScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import styles from '../styles'; 

export default function RegistrationScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // State for delete confirmation dialog

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // Simple email regex pattern
    return re.test(email);
  };

  const validatePasswordStrength = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleRegister = async () => {
    // Check if password is strong enough
    if (!validatePasswordStrength(password)) {
      alert("Password need to be at least 8 characters long, include a number, lowercase/uppercase letter, and a special character.")
      return;
    }

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
      const response = await fetch('http://localhost:3000/user/register', { // this http may not be valid for you, run ngrok http 3000 to get new url
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
        navigation.navigate('Login');
      } else {
        // If the backend returns an error (e.g., email already exists), display it
        if (data.message === 'Email already in use') {
          alert('Registration Failed: Email already in use.');
        } else {
          alert('Registration Failed: ' + (data.message || 'Unknown error'));
        }
      }
    } catch (error) {
      // Handle any network or other errors
      alert('Registration Failed: ' + error.message);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = () => {
      return new Promise((resolve) => {
        Alert.alert(
          "Confirm Deletion",
          "Are you sure you want to delete your account? This action cannot be undone.",
          [
            {
              text: "Cancel",
              onPress: () => resolve(false),
              style: "cancel",
            },
            {
              text: "Delete",
              onPress: () => resolve(true),
            },
          ],
          { cancelable: false }
        );
      });
    };

    const shouldDelete = await confirmDelete();
    if (shouldDelete) {
      // Proceed with account deletion logic
      // ... existing deletion logic ...
    }
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
      <Pressable
        style={[styles.button, { backgroundColor: '#ff4136', marginTop: 20 }]} // Red background
        onPress={() => setIsDeleteDialogOpen(true)} // Open delete confirmation dialog
      >
        <Text style={[styles.buttonText, { color: 'white' }]}>Delete Account</Text>
      </Pressable>
      <Modal
        animationType="none"
        transparent={true}
        visible={isDeleteDialogOpen}
        onRequestClose={() => setIsDeleteDialogOpen(false)}
      >
        <View style={styles.SignoutCenteredView}>
          <View style={styles.SignoutModalView}>
            <Text style={styles.SignoutModalTitle}>Are you sure you want to delete your account?</Text>
            <Text style={styles.SignoutModalText}>This action cannot be undone.</Text>
            <View style={styles.SignoutModalButtonContainer}>
              <Pressable
                style={[styles.SignoutButton, styles.SignoutButtonOutline]}
                onPress={() => setIsDeleteDialogOpen(false)}
              >
                <Text style={styles.SignoutButtonOutlineText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.SignoutButton, styles.SignoutButtonFilled]}
                onPress={handleDeleteAccount}
              >
                <Text style={styles.SignoutButtonFilledText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}


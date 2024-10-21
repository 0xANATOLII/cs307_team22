// screens/NearbyMonumentScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import styles from '../styles'; 
import Config from "../config.js";

export default function NearbyMonumentScreen() {
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


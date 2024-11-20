import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography, commonStyles } from './theme';
import GradientButton from './Components/GradientButton';
import Config from "../config";

const RegistrationScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePasswordStrength = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };
  const cancelRegister = async () => {
    navigation.navigate('Home')
  }
  const handleRegister = async () => {
    if (!validatePasswordStrength(password)) {
      alert("Password needs to be at least 8 characters long, include a number, lowercase/uppercase letter, and a special character.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (!validateEmail(email)) {
      alert("Invalid email format!");
      return;
    }

    try {
      const payload = {
        username: username,
        email: email,
        password: password,
      };

      const response = await fetch(`${Config.API_URL}/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registration Successful');
        navigation.navigate('Home');
      } else {
        if (data.message === 'Email already in use') {
          alert('Registration Failed: Email already in use.');
        } else {
          alert('Registration Failed: ' + (data.message || 'Unknown error'));
        }
      }
    } catch (error) {
      alert('Registration Failed: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Register</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor={colors.textSecondary}
          value={username}
          onChangeText={setUsername}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.textSecondary}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={colors.textSecondary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor={colors.textSecondary}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        <GradientButton 
          onPress={handleRegister}
          title={"Register"}
          outerstyle={styles.button}
          innerstyle={styles.buttonInner}
        />
        <GradientButton 
          onPress={cancelRegister}
          title={"Cancel"}
          outerstyle={styles.button}
          innerstyle={styles.buttonInner}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
    justifyContent: 'center',
  },
  formContainer: {
    padding: spacing.xl,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  input: {
    ...commonStyles.input,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.lg,
    width: '100%',
  },
  button: {
    marginTop: spacing.xs,
    width: '100%',
  },
  buttonInner: {
    padding: spacing.md,
  }
});

export default RegistrationScreen;
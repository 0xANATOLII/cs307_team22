// screens/HomePage.js
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Image, Switch } from 'react-native';
import styles from '../styles'; 
import Config from "../config.js";
import LoadingVideo from '../components/LoadingVideo';
import TutorialCarousel from './TutorialComponent';

export default function HomePage({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  const handleLogin = async () => {
    if (!username || !password) {
      alert('Please enter both username and password');
      return;
    }

    if (animationsEnabled) {
      setIsLoading(true);
    } else {
      handleVideoComplete();
    }
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
        //Add the TutorialComponent right here if the person has not gone through it before
        const tutorialresponse = await fetch(`${Config.API_URL}/user/profile/${username}`);
        if (tutorialresponse.ok) {
          const tutorialdata = await tutorialresponse.json();
          console.log('Profile data fetched:', tutorialdata);
          setShowTutorial(!tutorialdata.tutorial);
          if (tutorialdata.tutorial) {
            navigation.navigate('Map', { username });
          }
        } else {
          console.error('Failed to load profile data');
        }
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      alert('Login Failed: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTutorialComplete = async () => {
    try {
      const response = await fetch(`${Config.API_URL}/user/updateTutorial`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, tutorial: true }), // Done with first tutorial
      });
      setShowTutorial(false);
      const data = await response.json();
  
      console.log('Response status:', response.status); // Log status
      console.log('Response data:', data); // Log data
  
      if (response.ok) {
        console.log('Tutorial updated:', data.message);
      } else {
        Alert.alert('Error', data.message || 'Failed to update tutorial setting.');
      }
    } catch (error) {
      console.error('Fetch error:', error); // Log fetch errors
      Alert.alert('Error', 'Could not update tutorial setting.');
    }

    navigation.navigate('Map', { username });
  };

  if (showTutorial) {
    return <TutorialCarousel onComplete={handleTutorialComplete} />;
  }

  return (
    <View style={styles.container}>
      <LoadingVideo 
        isLoading={isLoading} 
        onLoadingComplete={handleVideoComplete}
        enabled={animationsEnabled}
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
          //onPress={() => navigation.navigate('BadgePage',{acusername:"tolik",acbadgeId:"67350a19d6f4fd220b54eadf",com_username:"vencia",com_userId:"672506b1e52c56a2d04a2160"})}

          //acIs a data for badge // com is data for current user
          onPress={() => navigation.navigate('BadgePage',{acusername:"tolik",acbadgeId:"67350a19d6f4fd220b54eadf",com_username:"PassisBbbbbb1!",com_userId:"67155e33be3aaa938a64b997"})}
          
          style={({ pressed }) => [
            styles.button,
            pressed && { backgroundColor: '#555' }
          ]}
        >
          <Text style={styles.buttonText}>BadgePage</Text>
        </Pressable>
      </View>
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleLabel}>Enable Animations</Text>
            <Switch
              value={animationsEnabled}
              onValueChange={setAnimationsEnabled}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={animationsEnabled ? "#f5dd4b" : "#f4f3f4"}
            />
          </View>
        </>
      )}
      
    </View>
  );
}

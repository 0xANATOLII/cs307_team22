import React, { useContext, useEffect } from 'react';
import { Link, LinkingContext, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as  Linking  from 'expo-linking';
import HomePage from './Screens/HomePage';
import RegistrationScreen from './Screens/RegistrationScreen';
import ForgotPasswordScreen from './Screens/ForgotPasswordScreen';
import ProfileScreen from './Screens/Profile/ProfileScreen';
import ResetPasswordScreen from './Screens/ResetPasswordScreen';
import BadgeFeedScreen from './Screens/BadgeFeedScreen';
import MapPage from './Screens/MapPage';
import NearbyMonumentScreen from './Screens/NearbyMonumentScreen';
import CameraPage from './Screens/BadgeCreate';
import FriendsScreen from './Screens/FriendsScreen';
import { LocationContext, LocationProvider } from './Screens/Components/locationContext';
import BadgePage from './Screens/BadgePage';

const prefix = Linking.createURL('/');

const Stack = createStackNavigator(); 

export default function App() {
  
  useEffect(()=>{
    console.log("PREFFFFFIIIIXXX ::::::::::::::::::::"+prefix)
    console.log(Linking.getLinkingURL())
  },[])
  // Deep Linking Configuration
  const linking = {
    prefixes: [prefix],
    config: {
      screens: {
        Home: 'home',
        Registration: 'registration',
        ForgotPassword: 'forgot-password',
        Profile: 'profile',
        ResetPassword: 'reset-password/:token', // The token parameter is part of the URL
        BadgeFeed: 'badge-feed',
        FriendsScreen: 'friends',
        Monument: 'monument',
        CameraRoll: 'camera-roll',
        Map: 'map',
        BadgePage:'badge/:acusername/:acbadgeId'
      },
    },
  };

  return (
    <LocationProvider >
      <NavigationContainer linking={linking}>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
            animationEnabled: false,
            gestureEnabled: false,
          }}
        >
          <Stack.Screen name="Home" component={HomePage} />
          <Stack.Screen name="Registration" component={RegistrationScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Monument" component={NearbyMonumentScreen} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
          <Stack.Screen name="BadgeFeed" component={BadgeFeedScreen} />
          <Stack.Screen name="Map" component={MapPage} />
          <Stack.Screen name="Friends" component={FriendsScreen} />
          <Stack.Screen name="CameraRoll" component={CameraPage} />
          <Stack.Screen name="BadgePage" component={BadgePage} />
        </Stack.Navigator>
      </NavigationContainer>
    </LocationProvider>
  );
}

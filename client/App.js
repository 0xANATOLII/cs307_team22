import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomePage from './Screens/HomePage';
import RegistrationScreen from './Screens/RegistrationScreen';
import ForgotPasswordScreen from './Screens/ForgotPasswordScreen';
import ProfileScreen from './Screens/Profile/ProfileScreen';
import ResetPasswordScreen from './Screens/ResetPasswordScreen';
import BadgeFeedScreen from './Screens/BadgeFeedScreen';
import MapPage from './Screens/MapPage';
import Config from "./config.js";
import NearbyMonumentScreen from './Screens/NearbyMonumentScreen';
import CameraPage from './Screens/BadgeCreate';


const Stack = createStackNavigator();

const linking = {
  prefixes: [Config.API_URL, 'myapp://'],
  config: {
    screens: {
      Home: 'home',
      Registration: 'registration',
      ForgotPassword: 'forgot-password',  // No spaces
      Profile: 'profile',
      ResetPassword: 'reset-password/:token', // The token parameter is part of the URL
      BeBoiler: 'navigation',
      BadgeFeed: 'badge-feed'
    },
  },
};

export default function App() {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator initialRouteName="Home" screenOptions={{
        headerShown: false,
        animationEnabled: false,
        gestureEnabled: false,
      }}>
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="Registration" component={RegistrationScreen} />
        <Stack.Screen 
          name="ForgotPassword" 
          component={ForgotPasswordScreen} 
          options={{ title: 'Forgot Password' }} // Display title with spaces
        />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Monument" component={NearbyMonumentScreen} />
        <Stack.Screen 
          name="ResetPassword" 
          component={ResetPasswordScreen} 
          options={{ title: 'Reset Password' }} 
        />
        <Stack.Screen 
          name="BadgeFeed" 
          component={BadgeFeedScreen} 
          options={{ title: 'Badge Feed' }} 
         />
        <Stack.Screen 
          name="Map"
          component={MapPage}
          options={{title: 'Map'}}
        />

        <Stack.Screen 
          name="CameraRoll"
          component={CameraPage}
          options={{title: 'Camera'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

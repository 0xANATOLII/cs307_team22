import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomePage from './Screens/HomePage';
import RegistrationScreen from './Screens/RegistrationScreen';
import ForgotPasswordScreen from './Screens/ForgotPasswordScreen';
import ProfileScreen from './Screens/Profile/ProfileScreen';
import ResetPasswordScreen from './Screens/ResetPasswordScreen';
import BeBoilerScreen from './Screens/BeBoilerScreen'

const Stack = createStackNavigator();

const linking = {
  prefixes: ['http://localhost:8081', 'myapp://'],
  config: {
    screens: {
      Home: 'home',
      Registration: 'registration',
      ForgotPassword: 'forgot-password',  // No spaces
      Profile: 'profile',
      ResetPassword: 'reset-password/:token', // The token parameter is part of the URL
      BeBoiler: 'navigation'
    },
  },
};

export default function App() {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="Registration" component={RegistrationScreen} />
        <Stack.Screen 
          name="ForgotPassword" 
          component={ForgotPasswordScreen} 
          options={{ title: 'Forgot Password' }} // Display title with spaces
        />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen 
          name="ResetPassword" 
          component={ResetPasswordScreen} 
          options={{ title: 'Reset Password' }} 
        />
        <Stack.Screen 
          name="BeBoiler" 
          component={BeBoilerScreen} 
          options={{ title: 'Be Boiler' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

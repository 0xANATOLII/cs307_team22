// screens/HomePage.js
import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

export default function HomePage({ navigation }) {
  return (
    <View style={styles.container}>
      <Button 
        title="Login" 
        onPress={() => navigation.navigate('Login')}
      />
      <Button 
        title="Register" 
        onPress={() => navigation.navigate('Registration')}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  button: {
    marginVertical: 10,
  },
});

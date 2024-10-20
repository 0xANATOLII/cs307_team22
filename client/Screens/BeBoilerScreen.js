import React from 'react';
import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomePage({ route }) {
  const navigation = useNavigation();
  const { username } = route.params; // Assuming username is passed as a param to HomePage

  return (
    <View style={styles.container}>
      {/* Profile icon in the top-right corner */}
      <Pressable style={styles.profileIcon} onPress={() => navigation.navigate('Profile', { username })}>
        <Image source={require('../assets/purduepete.png')} style={styles.iconImage} />
      </Pressable>

      {/* Main map placeholder */}
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapText}>Map Placeholder</Text>
      </View>

      {/* Bottom navigation bar */}
      <View style={styles.bottomBar}>
        <Pressable style={styles.navButton} onPress={() => navigation.navigate('BadgeFeed')}>
          <Text style={styles.navText}>Badges</Text>
        </Pressable>
        <Pressable style={styles.navButton} onPress={() => navigation.navigate()}>
          <Text style={styles.navText}>Explore</Text>
        </Pressable>
        <Pressable style={styles.navButton} onPress={() => navigation.navigate()}>
          <Text style={styles.navText}>Friends</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  profileIcon: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  iconImage: {
    width: 40,
    height: 40,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  mapText: {
    fontSize: 24,
    color: '#888',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#eee',
  },
  navButton: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 16,
  },
});

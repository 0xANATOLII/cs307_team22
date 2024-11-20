import React from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { colors, spacing, typography } from './theme';

const BottomNav = ({ navigation, route, closestMarkers, userLocation, currentScreen }) => {
  const { username } = route.params;
  const navigateToScreen = (screenName) => {
    navigation.navigate(screenName, { 
      username, 
      closestMarkers, 
      userLocation 
    });
  };

  const navItems = [
    { screen: 'CameraRoll', label: 'Camera', icon: 'camera' },
    { screen: 'BadgeFeed', label: 'Badges', icon: 'chat' },
    { screen: 'Monument', label: 'Monuments', icon: 'star' },
    { screen: 'Map', label: 'Map', icon: 'map' },
    { screen: 'Friends', label: 'Friends', icon: 'people' },
    { screen: 'Profile', label: 'Profile', icon: 'person' },
  ];

  return (
    <View style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 80,
      backgroundColor: colors.background,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingBottom: Platform.OS === 'ios' ? 20 : 0,
      elevation: 8,
      shadowColor: colors.primary,
      shadowOffset: {
        width: 0,
        height: -2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
    }}>
      {navItems.map((item, index) => (
        <Pressable 
          key={index} 
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: spacing.sm,
          }}
          onPress={() => navigateToScreen(item.screen)}
        >
          <MaterialIcons 
            name={item.icon} 
            size={28} 
            color={currentScreen === item.screen ? colors.primary : colors.inactive} 
          />
          <Text style={{
            fontSize: typography.sizes.xs,
            marginTop: spacing.xs,
            color: currentScreen === item.screen ? colors.primary : colors.inactive,
            fontWeight: currentScreen === item.screen ? typography.weights.semibold : typography.weights.regular,
          }}>
            {item.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

export default BottomNav;
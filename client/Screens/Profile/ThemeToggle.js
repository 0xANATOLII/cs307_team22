import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../context/ThemeContext';
import { colors } from '../theme';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Pressable 
      style={[
        styles.themeToggleButton,
        { backgroundColor: isDarkMode ? colors.surface : colors.background }
      ]} 
      onPress={toggleTheme}
    >
      <MaterialCommunityIcons
        name={isDarkMode ? 'weather-night' : 'weather-sunny'}
        size={24}
        color={isDarkMode ? colors.textPrimary : colors.textSecondary}
      />
      <Text style={[
        styles.themeToggleText,
        { color: isDarkMode ? colors.textPrimary : colors.textSecondary }
      ]}>
        {isDarkMode ? 'Dark Mode' : 'Light Mode'}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  themeToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  themeToggleText: {
    marginLeft: 10,
  },
});

export default ThemeToggle; 
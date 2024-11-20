import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { commonStyles,gradients } from '../theme';

const GradientButton = ({ onPress, title, outerstyle, innerstyle }) => {
  return (
    <TouchableOpacity style={[commonStyles.buttonBase, outerstyle]} onPress={onPress}>
      <LinearGradient 
        colors={gradients.primary} 
        style={[commonStyles.primaryButton, innerstyle]}
      >
        <Text style={commonStyles.primaryButtonText}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default GradientButton;
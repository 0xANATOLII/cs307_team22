import React, { useState } from 'react';
import { View, Text, Image, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius, commonStyles } from './theme';

const { width: screenWidth } = Dimensions.get('window');
const cardWidth = Math.min(screenWidth - (spacing.lg * 2), 400); // Max width of 400, accounting for padding
const cardAspectRatio = 1.5; // This will make the card height 1.5x its width
const cardHeight = cardWidth * cardAspectRatio;

const TutorialCarousel = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Define images statically to allow proper bundling
  const tutorialScreens = [
    {
      image: require('../assets/HomeScreen.jpg'),
      title: "Welcome to Our App!",
      description: "Swipe through to learn about our main features"
    },
    {
      image: require('../assets/MapScreen.jpg'),
      title: "Where am I?",
      description: "Use this screen to view your location!\n(I wonder what those icons are...) "
    },
    {
      image: require('../assets/MonumentsScreen.jpg'),
      title: "Nearby Monuments",
      description: "Use this to see how close you are to a monument and add them to your wishlist!"
    },
    {
      image: require('../assets/FriendsScreen.jpg'),
      title: "Stay Connected",
      description: "Compare your bages with friends and see where they've been!"
    },
    {
      image: require('../assets/BadgeCreation.jpg'),
      title: "Create some badges",
      description: "Create your own badge for a monument and explain what you saw!"
    },
    {
      image: require('../assets/BadgeFeed.jpeg'),
      title: "Like and Comment",
      description: "Share your thoughts on a friends badge and show some support!"
    }
  ];

  const handleNext = () => {
    if (currentIndex < tutorialScreens.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* Skip button */}
      <TouchableOpacity 
        onPress={onComplete}
        style={styles.skipButton}
      >
        <Text style={styles.topButtonText}>Skip</Text>
      </TouchableOpacity>

      {/* Back button */}
      {currentIndex > 0 && (
        <TouchableOpacity 
          onPress={handleBack}
          style={styles.backButton}
        >
          <Text style={styles.topButtonText}>Back</Text>
        </TouchableOpacity>
      )}

      {/* Main content */}
      <TouchableOpacity 
        onPress={handleNext}
        style={styles.slideContainer}
      >
        <View style={styles.card}>
          {/* Image */}
          <Image
            source={tutorialScreens[currentIndex].image}
            style={styles.image}
            resizeMode="cover"
          />
          
          {/* Text overlay */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>
              {tutorialScreens[currentIndex].title}
            </Text>
            <Text style={styles.description}>
              {tutorialScreens[currentIndex].description}
            </Text>
          </View>

          {/* Progress dots */}
          <View style={styles.progressContainer}>
            {tutorialScreens.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentIndex && styles.activeDot
                ]}
              />
            ))}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...commonStyles.safeArea,
    position: 'relative',
  },
  skipButton: {
    position: 'absolute',
    top: spacing.xxl,
    right: spacing.lg,
    zIndex: 10,
    padding: spacing.sm,
  },
  backButton: {
    position: 'absolute',
    top: spacing.xxl,
    left: spacing.lg,
    zIndex: 10,
    padding: spacing.sm,
  },
  topButtonText: {
    color: colors.primary,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
  },
  slideContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    ...commonStyles.card,
    width: cardWidth,
    height: cardHeight,
    padding: 0,
    overflow: 'hidden',
    backgroundColor: colors.background,
  },
  image: {
    width: '100%',
    height: '70%', // Image takes up 60% of card height
    resizeMode: 'cover',
  },
  textContainer: {
    padding: spacing.xl,
    height: '30%', // Text container takes remaining 40% of card height
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    lineHeight: typography.sizes.md * 1.5,
  },
  progressContainer: {
    position: 'absolute',
    bottom: spacing.xl,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dot: {
    height: spacing.sm,
    width: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.inactive,
  },
  activeDot: {
    backgroundColor: colors.active,
  }
});

export default TutorialCarousel;
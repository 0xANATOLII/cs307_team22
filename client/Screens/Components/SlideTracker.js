import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureDetector, GestureHandlerRootView, Gesture } from 'react-native-gesture-handler';

export default function SlideTracker({ children, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown }) {
  const swipeGesture = Gesture.Swipe()
    .onEnd((event) => {
      if (event.velocityX > 0) {
        onSwipeRight && onSwipeRight();
      } else if (event.velocityX < 0) {
        onSwipeLeft && onSwipeLeft(); 
      } else if (event.velocityY > 0) {
        onSwipeDown && onSwipeDown(); 
      } else if (event.velocityY < 0) {
        onSwipeUp && onSwipeUp(); 
      }
    });

  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={swipeGesture}>
        <View style={styles.swipeArea}>
          {children}
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  swipeArea: {
    flex: 1,
  },
});

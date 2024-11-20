import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { View, Text, Modal, StyleSheet, Dimensions } from 'react-native';
import { runOnJS } from 'react-native-reanimated';

const { height } = Dimensions.get('window');

const TestPage = ({ visible, setVisible }) => {
  const translateY = useSharedValue(height * 0.3);

  // Gesture threshold (e.g., dragged beyond 70% of height, fully open to 100%)
  const openThreshold = height * 0.2; // Adjust as needed

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // Gesture detector setup
  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
        // Clamp translateY between 0 (fully open) and height (fully closed)
       
        translateY.value = Math.min(height, Math.max(0, height * 0.3 + e.translationY));
      })      
      .onEnd((e) => {
        if (e.translationY < -openThreshold) {
            console.log("Opening to 100%");
          // If dragged up past the threshold, open to 100% height
          translateY.value = withSpring(0); // Fully open
        } else if (e.translationY > height * 0.5) {

            console.log("Closing panel");
          
          translateY.value = withSpring(height, {}, () => {
         
            runOnJS(setVisible)(false);
          });
          //onClose();
        } else {
            console.log("Returning to 70%");
          // Otherwise, snap back to 70% height
          translateY.value = withSpring(height * 0.3);
        }
      })

  if (!visible) return (<View></View>);

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.container, animatedStyle]}>
            <View style={styles.header}>
              <Text style={styles.handle} />
              <Text style={styles.title}>Comments</Text>
            </View>
            <Text style={styles.comment}>This is where comments will go...</Text>
          </Animated.View>
        </GestureDetector>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 2.5,
    marginBottom: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  comment: {
    padding: 20,
    fontSize: 14,
    color: '#333',
  },
});

export default TestPage;

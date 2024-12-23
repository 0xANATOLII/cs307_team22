import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Video } from 'expo-av';

const LoadingVideo = ({ isLoading, onLoadingComplete, enabled }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    // Preload the video only if animations are enabled
    if (videoRef.current && enabled) {
      videoRef.current.loadAsync(
        require('../assets/Be (Your Story) (2).mp4'),
        { shouldPlay: false },
        false
      );
    }
  }, [enabled]);

  if (!isLoading || !enabled) return null;

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={require('../assets/Be (Your Story) (2).mp4')}
        style={styles.video}
        resizeMode="cover"
        shouldPlay={true}
        isLooping={false}
        isMuted={true}
        onPlaybackStatusUpdate={(status) => {
          if (status.didJustFinish) {
            // Video finished playing
            onLoadingComplete();
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  video: {
    width: '100%',
    height: '100%',
  },
});

export default LoadingVideo; 
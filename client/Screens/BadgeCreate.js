import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import { useContext, useRef, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, Dimensions, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MapPage from './MapPage';
import { LocationContext } from './Components/locationContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, commonStyles, spacing, borderRadius, typography } from './theme';

const GradientButton = ({ onPress, title }) => (
  <TouchableOpacity style={commonStyles.buttonBase} onPress={onPress}>
    <LinearGradient colors={gradients.primary} style={{ ...commonStyles.primaryButton, padding: spacing.lg,}}>
      <Text style={commonStyles.primaryButtonText}>{title}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

export default function CameraPage({ route, navigation }) {
  const { closestMon, location, setClosestMon, setLocation } = useContext(LocationContext);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('back');
  const [facing_f, setFacing_f] = useState('front');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photof, setPhotof] = useState(null);
  const [activePhoto, setActivePhoto] = useState(0);
  const cameraRef = useRef(null);
  const cameraRef_f = useRef(null);

  if (!permission) {
    return <SafeAreaView style={commonStyles.safeArea}></SafeAreaView>;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={commonStyles.safeArea}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>We need your permission to show the camera</Text>
          <TouchableOpacity 
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  function toggleCameraFacingf() {
    setFacing_f(current => (current === 'front' ? 'back' : 'front'));
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setPhoto(photo);
    }
  };

  const takePicturef = async () => {
    if (cameraRef_f.current) {
      const photo_f = await cameraRef_f.current.takePictureAsync();
      setPhotof(photo_f);
    }
  };

  const back_n = () => {
    navigation.navigate('Map', { username: route.params.username });
  };

  if (photo && photof) {
    return (
      <View style={commonStyles.container}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          bounces={false}
        >
          <View style={styles.carouselContainer}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={16}
              bounces={false}
            >
              <View style={styles.slideContainer}>
                <Image 
                  source={{ uri: photo.uri }}
                  style={commonStyles.image}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.slideContainer}>
                <Image 
                  source={{ uri: photof.uri }}
                  style={commonStyles.image}
                  resizeMode="cover"
                />
              </View>
            </ScrollView>
            <View style={styles.indicatorContainer}>
              <View style={[styles.indicator, activePhoto === 0 && styles.activeIndicator]} />
              <View style={[styles.indicator, activePhoto === 1 && styles.activeIndicator]} />
            </View>
          </View>

          <View style={styles.contentContainer}>
            <Text style={commonStyles.label}>Description</Text>
            <TextInput
              style={[commonStyles.input, styles.descriptionInput]}
              placeholder="Write your description here..."
              placeholderTextColor={colors.textSecondary}
              value={description}
              onChangeText={setDescription}
              multiline
            />

            <Text style={commonStyles.label}>Location</Text>
            <View style={styles.mapContainer}>
              <MapPage route={route} navigation={navigation} isMiniMap={true} />
            </View>

            <View style={styles.buttonContainer}>
              <GradientButton 
                title="Post"
                onPress={() => alert("POST")}
              />

              <View style={styles.secondaryButtons}>
                <TouchableOpacity
                  style={[commonStyles.buttonBase, commonStyles.secondaryButton, { flex: 1, padding: spacing.lg}]}
                  onPress={() => { setPhoto(null); setPhotof(null); }}
                >
                  <Text style={commonStyles.secondaryButtonText}>Retake</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[commonStyles.buttonBase, commonStyles.secondaryButton, { flex: 1, padding: spacing.lg,}]}
                  onPress={back_n}
                >
                  <Text style={commonStyles.secondaryButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Camera views remain largely the same but with updated styles
  else if (photo) {
    return (
      <View style={commonStyles.container}>
        <CameraView style={styles.camera} facing={facing_f} ref={cameraRef_f}>
          <View style={styles.cameraOverlay}>
            <View style={styles.cameraControls}>
              <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacingf}>
                <MaterialIcons name="flip-camera-ios" size={40} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.captureButton} onPress={takePicturef}>
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      </View>
    );
  }

  else if (photof) {
    return (
      <View style={commonStyles.container}>
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          <View style={styles.cameraOverlay}>
            <View style={styles.cameraControls}>
              <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
                <MaterialIcons name="flip-camera-ios" size={40} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      </View>
    );
  }

  else(!photo && !photof)
  return (
    <View style={commonStyles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.cameraOverlay}>
          <View style={styles.cameraControls}>
            <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
              <MaterialIcons name="flip-camera-ios" size={40} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  carouselContainer: {
    paddingTop: 50,
    height: Dimensions.get('window').height * 0.9,
    position: 'relative',
    marginBottom: spacing.lg,
  },
  slideContainer: {
    width: Dimensions.get('window').width,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: spacing.xl,
    width: '100%',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.full,
    backgroundColor: colors.inactive,
    marginHorizontal: spacing.xs,
  },
  activeIndicator: {
    backgroundColor: colors.active,
  },
  contentContainer: {
    padding: spacing.lg,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  mapContainer: {
    height: 200,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  buttonContainer: {
    gap: spacing.md,
  },
  secondaryButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  camera: {
    flex: 1,
    backgroundColor: colors.background,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  cameraControls: {
    position: 'absolute',
    bottom: spacing.xl,
    alignSelf: 'center',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  flipButton: {
    padding: spacing.sm,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
  },
  permissionContainer: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  permissionText: {
    color: colors.textPrimary,
    fontSize: typography.sizes.md,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  permissionButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  permissionButtonText: {
    color: colors.background,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
  },
});
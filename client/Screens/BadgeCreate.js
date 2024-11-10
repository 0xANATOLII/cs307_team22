import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import { useContext, useRef, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, Dimensions, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MapPage from './MapPage';
import { LocationContext } from './Components/locationContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

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
    return <SafeAreaView style={styles.safeArea}></SafeAreaView>;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.safeArea}>
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
      <View style={styles.container}>
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
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.slideContainer}>
                <Image 
                  source={{ uri: photof.uri }}
                  style={styles.image}
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
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.descriptionInput}
              placeholder="Write your description here..."
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={description}
              onChangeText={setDescription}
              multiline
            />

            <Text style={styles.label}>Location</Text>
            <View style={styles.mapContainer}>
              <MapPage route={route} navigation={navigation} isMiniMap={true} />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.postButton]}
                onPress={() => alert("POST")}
              >
                <LinearGradient
                  colors={['#FFD700', '#FFA500']}
                  style={styles.gradientButton}
                >
                  <Text style={styles.postButtonText}>Post</Text>
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.secondaryButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.secondaryButton]}
                  onPress={() => { setPhoto(null); setPhotof(null); }}
                >
                  <Text style={styles.secondaryButtonText}>Retake</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.secondaryButton]}
                  onPress={back_n}
                >
                  <Text style={styles.secondaryButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  else if (photo) {
    return (
      <View style={styles.container}>
        <CameraView style={styles.camera} facing={facing_f} ref={cameraRef_f}>
          <View style={styles.cameraOverlay}>
            <View style={styles.cameraControls}>
              <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacingf}>
                <MaterialIcons name="flip-camera-ios" size={40} color="#FFD700" />
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
      <View style={styles.container}>
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          <View style={styles.cameraOverlay}>
            <View style={styles.cameraControls}>
              <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacingf}>
                <MaterialIcons name="flip-camera-ios" size={40} color="#FFD700" />
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

  else(!photo && !photof)
  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.cameraOverlay}>
          <View style={styles.cameraControls}>
            <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
              <MaterialIcons name="flip-camera-ios" size={40} color="#FFD700" />
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
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#121212',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionContainer: {
    padding: 20,
    alignItems: 'center',
  },
  permissionText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  permissionButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  permissionButtonText: {
    color: '#121212',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContent: {
    flexGrow: 1,
  },
  carouselContainer: {
    height: Dimensions.get('window').height * 0.9,
    position: 'relative',
    marginBottom: 20,
  },
  slideContainer: {
    width: Dimensions.get('window').width,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.5)',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  activeImage: {
    borderColor: '#FFD700',
    borderWidth: 3,
  },
  image: {
    width: '95%',
    height: '100%',
    borderRadius: 12,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 30,
    width: '100%',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#FFD700',
  },
  contentContainer: {
    padding: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFD700',
    marginBottom: 10,
  },
  descriptionInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
    color: 'white',
    marginBottom: 20,
    height: 100,
    textAlignVertical: 'top',
  },
  mapContainer: {
    height: 200,
    overflow: 'hidden',
    marginBottom: 20,
  },
  buttonContainer: {
    gap: 15,
  },
  button: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  postButton: {
    marginBottom: 10,
  },
  gradientButton: {
    padding: 15,
    alignItems: 'center',
  },
  postButtonText: {
    color: '#121212',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    alignItems: 'center',
    borderRadius: 25,
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: 16,
  },
  camera: {
    flex: 1,
    backgroundColor: '#121212',
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'space-between',
    padding: 20,
  },
  cameraText: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 40,
  },
  cameraControls: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  flipButton: {
    padding: 10,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFD700',
  },
});
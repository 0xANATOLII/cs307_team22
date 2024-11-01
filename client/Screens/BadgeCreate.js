import { Camera,CameraView,useCameraPermissions } from 'expo-camera'; // Use Camera instead of CameraView
import { useContext, useRef, useState } from 'react';
import { Button, StyleSheet, Text,TextInput, TouchableOpacity, View,Image ,Dimensions, ScrollView} from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import { MaterialIcons } from '@expo/vector-icons';
import MapPage from './MapPage';
import { LocationContext } from './Components/locationContext';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function CameraPage({route, navigation}) {

const { closestMon, location, setClosestMon, setLocation } = useContext(LocationContext)

const [permission, requestPermission] = useCameraPermissions();

const [facing, setFacing] = useState('back');
const [facing_f, setFacing_f] = useState('front');
const [description, setDescription] = useState('');

const screenHeight = Dimensions.get('window').height;
 // const [secFacing, setSecFacing] = useState('front');
  //const navigation = useNavigation(); // Use navigation to go back
  const [photo, setPhoto] = useState(null);
  const [photof, setPhotof] = useState(null);
  const cameraRef = useRef(null);
  const cameraRef_f = useRef(null);
  if (!permission) {
    return <SafeAreaView style={styles.safeArea}></SafeAreaView>;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View>
          <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
          <Button onPress={requestPermission} title="grant permission" />
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
    if ( cameraRef_f.current) {
      const photo_f = await cameraRef_f.current.takePictureAsync();
      setPhotof(photo_f);
    }
  };

  const back_n = ()=>{
    navigation.navigate('Map', { username: route.params.username });
  }
  //Post mode


if(photo && photof)
return (
 <ScrollView contentContainerStyle={post_styles.container}>

    <Image 
    source={{ uri: photo.uri }}  style={[post_styles.image, { height: screenHeight * 0.9 }]}
      resizeMode="cover"/>

    <Image 
    source={{ uri: photof.uri }}  style={[post_styles.image, { height: screenHeight * 0.9 }]}
      resizeMode="cover"/>

    <Text style={post_styles.label}>Description:</Text>
    <TextInput
      style={post_styles.descriptionInput}
      placeholder="Write your description here..."
      value={description}
      onChangeText={setDescription}
      multiline
    />

    <Text style={post_styles.label}>Location:</Text>


    <MapPage route={route} navigation={navigation} isMiniMap={true} >
    </MapPage>

   


    
    <TouchableOpacity style={styles.captureButton} onPress={()=>{alert("POST");}} >
    <Text style={styles.monumentText}>POST</Text>
    </TouchableOpacity>
    
    <TouchableOpacity style={styles.captureButton} onPress={()=>{ setPhoto(null), setPhotof(null)}} >
    <Text style={styles.monumentText}>Retake</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.captureButton} onPress={back_n} >
    <Text style={styles.monumentText}>Cancel</Text>
    </TouchableOpacity>
    
  </ScrollView>
);

if(photo)
    return (

        <View style={styles.container}>

        <CameraView style={styles.camera} facing={facing_f} ref={cameraRef_f} >
            <View style={styles.cameraControls}>
            
            <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacingf}>
                <MaterialIcons name="flip-camera-ios" size={40} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.captureButton} onPress={takePicturef} />
            </View>
        </CameraView>
       


    </View>


    )
if(!photo && !photof)
  return (
            <View style={styles.container}>



            <CameraView style={styles.camera} facing={facing} ref={cameraRef} >
                <View style={styles.cameraControls}>
                
                <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
                    <MaterialIcons name="flip-camera-ios" size={40} color="white" />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.captureButton} onPress={takePicture} />
                </View>
            </CameraView>
           


        </View>

  );
    }


const styles = StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: 'black',
        },
        camera: {
          flex: 1,
          justifyContent: 'flex-end',
        },
        cameraControls: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingBottom: 30,
        },
        captureButton: {
          alignSelf: 'center',
          backgroundColor: 'white',
          width: 70,
          height: 70,
          borderRadius: 35,
          borderColor: 'white',
          borderWidth: 5,
          marginBottom: 20,
        },
        flipButton: {
          alignSelf: 'flex-start',
          marginBottom: 20,
        },
        retakeButton: {
          position: 'absolute',
          bottom: 30,
          alignSelf: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 20,
        },
        permissionButton: {
          backgroundColor: '#1E90FF',
          padding: 15,
          borderRadius: 10,
          marginTop: 20,
        },
        text: {
          color: 'white',
          fontSize: 18,
          textAlign: 'center',
        },
      });

const post_styles = StyleSheet.create({
        container: {
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 10,
          backgroundColor: 'white',
        },
        image: {
          width: '100%',
          marginBottom: 20,
          borderRadius: 15,

        },
        label: {
          fontSize: 18,
          fontWeight: 'bold',
          marginTop: 10,
          marginBottom: 5,
          alignSelf: 'flex-start',
        },
        descriptionInput: {
          width: '100%',
          height: 100,
          borderColor: 'gray',
          borderWidth: 1,
          borderRadius: 10,
          padding: 10,
          textAlignVertical: 'top',
          marginBottom: 20,
          backgroundColor: '#f9f9f9',
        },
        map: {
          width: '100%',
          marginTop: 10,
          marginBottom: 20,
          borderRadius: 15,
        },
        monumentText: {
          fontSize: 24,
          fontWeight: 'bold',
          color: 'black',
          textAlign: 'center',
          marginTop: 10,
        },
      });
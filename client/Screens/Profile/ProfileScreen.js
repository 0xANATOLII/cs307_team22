import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Image, ScrollView, Pressable, Switch, ActivityIndicator, Alert, Platform } from 'react-native';
import ModalPopup from './Popup';
import styles from '../../styles';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'; // Import the image picker for mobile

export default function ProfileScreen({ route, navigation }) {
  const { username } = route.params;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSignOutDialogOpen, setIsSignOutDialogOpen] = useState(false);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); 
  const [profileInfo, setProfileInfo] = useState({
    username: username,
    pfp: null,
    desc: '',
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/user/profile/${username}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProfileInfo({
            username: data.username,
            pfp: data.pfp ? { uri: data.pfp } : require('./default.png'),
            desc: data.desc || '',
          });
          setIsPrivate(data.privacy);
        } else {
          Alert.alert('Error', 'Failed to load profile data.');
        }
      } catch (error) {
        Alert.alert('Error', 'Unable to fetch profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleSaveDescription = async (newDescription) => {
    try {
      const response = await fetch(`http://localhost:3000/user/updateDescription`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, description: newDescription }),
      });

      if (response.ok) {
        setProfileInfo((prev) => ({ ...prev, desc: newDescription }));
        Alert.alert('Success', 'Description updated successfully!');
      } else {
        Alert.alert('Error', 'Failed to update description');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while updating the description.');
    }
  };

  const togglePrivacy = async () => {
    const newPrivacySetting = !isPrivate;
    setIsPrivate(newPrivacySetting);

    try {
      const response = await fetch('http://localhost:3000/user/updatePrivacy', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, privacy: newPrivacySetting }),
      });

      if (!response.ok) {
        Alert.alert('Error', 'Failed to update privacy setting.');
        setIsPrivate(!newPrivacySetting);
      }
    } catch (error) {
      Alert.alert('Error', 'Could not update privacy setting.');
      setIsPrivate(!newPrivacySetting);
    }
  };

  const handleSignOut = async () => {
    try {
      const response = await fetch('http://localhost:3000/user/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      if (response.ok) {
        navigation.navigate('Home');
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'Failed to sign out. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while signing out. Please check your connection and try again.');
    } finally {
      setIsSignOutDialogOpen(false);
    }
  };

  // Function to open the camera or image library on mobile, or file input for web
  const handleProfileImagePress = () => {
    if (Platform.OS === 'web') {
      document.getElementById('profilePicInput').click(); // Trigger file input for web
    } else {
      Alert.alert('Upload Profile Picture', 'Choose an option:', [
        {
          text: 'Take Photo',
          onPress: handleTakePhoto,
        },
        {
          text: 'Choose from Library',
          onPress: handleChoosePhoto,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]);
    }
  };

  // Open the camera (mobile only)
  const handleTakePhoto = () => {
    launchCamera(
      { mediaType: 'photo', saveToPhotos: true },
      (response) => {
        if (response.assets) {
          setSelectedImage({ uri: response.assets[0].uri });
          setIsUploadModalVisible(true); // Show modal to confirm upload
        }
      }
    );
  };

  // Open the image library (mobile only)
  const handleChoosePhoto = () => {
    launchImageLibrary(
      { mediaType: 'photo' },
      (response) => {
        if (response.assets) {
          setSelectedImage({ uri: response.assets[0].uri });
          setIsUploadModalVisible(true); // Show modal to confirm upload
        }
      }
    );
  };

  // File input change handler (for web)
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage({ uri: imageUrl });
      setIsUploadModalVisible(true); // Show modal to confirm upload
    }
  };
  // Upload the selected image and update the profile picture
  const handleUploadImage = async () => {
    try {
      const formData = new FormData();
      formData.append('username', profileInfo.username);
      formData.append('pfp', {
        uri: selectedImage.uri,
        name: 'profile.jpg',
        type: 'image/jpeg',
      });
  
      const response = await fetch('http://localhost:3000/user/uploadProfilePic', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
  
      if (response.ok) {
        const data = await response.json();
        setProfileInfo((prev) => ({ ...prev, pfp: { uri: data.pfp } }));
        Alert.alert('Success', 'Profile picture updated successfully!');
      } else {
        Alert.alert('Error', 'Failed to upload profile picture.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while uploading the profile picture.');
    } finally {
      setIsUploadModalVisible(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{ alignItems: 'center', marginVertical: 20 }}>
        {/* Profile Picture Upload */}
        <Pressable onPress={handleProfileImagePress}>
          <Image source={profileInfo.pfp || require('./default.png')} style={styles.profilePhoto} />
        </Pressable>

        {/* File input for web */}
        {Platform.OS === 'web' && (
          <input
            type="file"
            id="profilePicInput"
            accept="image/*"
            style={{ display: 'none' }} // Hidden file input
            onChange={handleFileChange}
          />
        )}

        {/* Username */}
        <Text style={styles.title}>{profileInfo.username}</Text>

        {/* Description Section */}
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.sectionText}>{profileInfo.desc}</Text>
        <Pressable
          style={[styles.button, { marginTop: 10, alignSelf: 'center' }]}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.buttonText}>Edit Description</Text>
        </Pressable>
        <ModalPopup
          editable={profileInfo.desc}
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onSave={handleSaveDescription}
        />

        {/* Privacy Section */}
        <Text style={styles.sectionTitle}>Privacy Settings</Text>
        <View style={[styles.privacyToggle, { flexDirection: 'row', justifyContent: 'space-between', width: '80%' }]}>
          <Text style={styles.sectionContent}>{isPrivate ? 'Private Mode' : 'Public Mode'}</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isPrivate ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={togglePrivacy}
            value={isPrivate}
          />
        </View>

        {/* Achievements Section */}
        <Text style={styles.sectionTitle}>Achievements</Text>
        <View style={styles.achievementList}>
          <View style={styles.achievement}>
            <Text style={styles.achievementTitle}>Master Coder</Text>
            <Text style={styles.achievementDesc}>Completed 100 coding challenges</Text>
          </View>
          <View style={styles.achievement}>
            <Text style={styles.achievementTitle}>Bug Squasher</Text>
            <Text style={styles.achievementDesc}>Fixed 50 critical bugs</Text>
          </View>
          <View style={styles.achievement}>
            <Text style={styles.achievementTitle}>Team Player</Text>
            <Text style={styles.achievementDesc}>Contributed to 10 open-source projects</Text>
          </View>
        </View>
      </View>

      {/* Sign Out Button */}
      <Pressable
        style={[styles.button, { backgroundColor: '#ff4136', marginTop: 20 }]}
        onPress={() => setIsSignOutDialogOpen(true)}
      >
        <Text style={[styles.buttonText, { color: 'white' }]}>Sign Out</Text>
      </Pressable>

      {/* Signout Modal */}
      <Modal
        animationType="none"
        transparent={true}
        visible={isSignOutDialogOpen}
        onRequestClose={() => setIsSignOutDialogOpen(false)}
      >
        <View style={styles.SignoutCenteredView}>
          <View style={styles.SignoutModalView}>
            <Text style={styles.SignoutModalTitle}>Are you sure you want to sign out?</Text>
            <Text style={styles.SignoutModalText}>This action will log you out of your account.</Text>
            <View style={styles.SignoutModalButtonContainer}>
              <Pressable
                style={[styles.SignoutButton, styles.SignoutButtonOutline]}
                onPress={() => setIsSignOutDialogOpen(false)}
              >
                <Text style={styles.SignoutButtonOutlineText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.SignoutButton, styles.SignoutButtonFilled]}
                onPress={handleSignOut}
              >
                <Text style={styles.SignoutButtonFilledText}>Sign Out</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal for confirming profile image upload */}
      <Modal
  transparent={true}
  visible={isUploadModalVisible}
  onRequestClose={() => setIsUploadModalVisible(false)}
  animationType="fade" // Add fade animation for a smoother appearance
>
  <View style={styles.modalBackdrop}>
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>Confirm Profile Picture</Text>
      
      {/* Preview of the selected image */}
      <Image source={selectedImage} style={styles.modalImagePreview} />
      
      <View style={styles.modalButtons}>
        <Pressable style={[styles.modalButton, styles.modalCancelButton]} onPress={() => setIsUploadModalVisible(false)}>
          <Text style={styles.modalButtonText}>Cancel</Text>
        </Pressable>

        <Pressable style={[styles.modalButton, styles.modalConfirmButton]} onPress={handleUploadImage}>
          <Text style={styles.modalButtonText}>Confirm</Text>
        </Pressable>
      </View>
    </View>
  </View>
</Modal>

    </ScrollView>
  );
}



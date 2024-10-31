import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Image, ScrollView, Pressable, Switch, ActivityIndicator, Alert, Platform, SafeAreaView, TextInput } from 'react-native';
import ModalPopup from './Popup';
import styles from '../../styles';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Config from "../../config.js";

export default function ProfileScreen({ route, navigation }) {
  const { username } = route.params;
  const [isUsernameModalVisible, setIsUsernameModalVisible] = useState(false);
  const [isDescriptionModalVisible, setIsDescriptionModalVisible] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSignOutDialogOpen, setIsSignOutDialogOpen] = useState(false);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); 
  const [profileInfo, setProfileInfo] = useState({
    username: username,
    pfp: null,
    desc: '',
    achievementList: [['Achievement 1','Description of Achievement'],['Achievement 2','Description of Achievement']],
    profileHistory: ['Change 1','Change 2'],
  });
  const [isDeleteAccountModalVisible, setIsDeleteAccountModalVisible] = useState(false);
  const [password, setPassword] = useState('');  // New state variable for password input
  const [isPasswordConfirmVisible, setIsPasswordConfirmVisible] = useState(false);  // Controls visibility of password input

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`${Config.API_URL}/user/profile/${username}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProfileInfo({
            userId: data._id,
            username: data.username,
            pfp: data.pfp ? { uri: data.pfp } : require('./default.png'),
            desc: data.desc || '',
            achievementList: [['Achievement 1','Description of Achievement'],['Achievement 2','Description of Achievement']],
            profileHistory: ['Change 1','Change 2'],
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

  const navigateToScreen = (screenName) => {
    navigation.navigate(screenName, { username });
  };

  const handleSaveDescription = async (newDescription) => {
    try {
      const response = await fetch(`${Config.API_URL}/user/updateDescription`, {
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
  const handleSaveUsername = async (newUsername) => {
    const confirmChange = () => {
      return new Promise((resolve) => {
        Alert.alert(
          "Confirm Change",
          "You can only change your username thrice, are you sure you want to proceed?",
          [
            {
              text: "Cancel",
              onPress: () => resolve(false), // Resolve the promise with false
              style: "cancel",
            },
            {
              text: "OK",
              onPress: () => resolve(true), // Resolve the promise with true
            },
          ],
          { cancelable: false }
        );
      });
    };
  
    await confirmChange();

    try {
      const response = await fetch(`${Config.API_URL}/user/updateUsername`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, username: newUsername}),
      });
      if (response.ok) {
        setProfileInfo((prev) => ({ ...prev, username: newUsername }));
        Alert.alert('Success', 'Username updated successfully!');
      } else {
        Alert.alert('Error', 'Failed to update username');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while updating the username.');
    }
  };


  const togglePrivacy = async () => {
    const newPrivacySetting = !isPrivate;

    try {
      const response = await fetch(`${Config.API_URL}/user/updatePrivacy`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, privacy: newPrivacySetting }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsPrivate(newPrivacySetting);
        console.log('Privacy updated:', data);
      } else {
        Alert.alert('Error', data.message || 'Failed to update privacy setting.');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not update privacy setting.');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch(`${Config.API_URL}/user/deleteAccount`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: profileInfo.username, password }),  // Send password with the request
      });
  
      if (response.ok) {
        Alert.alert('Success', 'Your account has been deleted. You can log back in within 100 seconds to restore your account.');
        navigation.navigate('Home');
      } else {
        Alert.alert('Error', 'Failed to delete account. Incorrect password.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to delete account: ' + error.message);
    } finally {
      setIsDeleteAccountModalVisible(false);
      setPassword('');  // Clear the password input
      setIsPasswordConfirmVisible(false);  // Reset password confirmation state
    }
  };

  const handleSignOut = async () => {
    // Implement sign-out logic if needed
    Alert.alert("Signed out", "You have successfully signed out.");
    navigation.navigate('Home');
  };

  const handleUploadImage = async () => {
    try {
      // Simulate the upload process and store the selected image in profileInfo
      setProfileInfo((prev) => ({ ...prev, pfp: { uri: selectedImage.uri } }));
      
      // Display success message
      Alert.alert('Success', 'Profile picture updated successfully!');
    } catch (error) {
      // Handle any unexpected errors
      Alert.alert('Error', 'An error occurred while updating the profile picture.');
    } finally {
      // Close the upload modal
      setIsUploadModalVisible(false);
    }
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.profileContainer}>
          {/* Profile Picture Upload */}
          <Pressable onPress={() => {}}>
            <Image source={profileInfo.pfp || require('./default.png')} style={styles.profilePhoto} />
          </Pressable>
  
         {/* Username */}
         <Text style={styles.title}>{profileInfo.username}</Text>
          <Pressable
              style={[styles.button, { marginTop: 10 }]}
              onPress={() => setIsUsernameModalVisible(true)}
            >
              <Text style={styles.buttonText}>Edit Username</Text>
          </Pressable>
  
          {/* Description Section */}
          <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.sectionText}>{profileInfo.desc}</Text>
              <Pressable
                style={[styles.button, { marginTop: 10 }]}
                onPress={() => setIsDescriptionModalVisible(true)}
              >
                <Text style={styles.buttonText}>Edit Description</Text>
              </Pressable>
          </View>
            {/* Privacy Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Privacy Settings</Text>
              <View style={styles.privacyToggle}>
                <Text style={styles.sectionContent}>{isPrivate ? 'Private Mode' : 'Public Mode'}</Text>
                <Switch
                  trackColor={{ false: '#767577', true: '#81b0ff' }}
                  thumbColor={isPrivate ? '#f5dd4b' : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={togglePrivacy}
                  value={isPrivate}
                />
              </View>
          </View>
  
          {/* Achievements Section */}
          <View style={styles.section}>
              <Text style={styles.sectionTitle}>Achievements</Text>
              <View style={styles.achievementList}>
                {profileInfo.achievementList.map((achievement, index) => (
                  <View key={index} style={styles.achievement}>
                    <Text style={styles.achievementTitle}>{achievement[0]}</Text>
                    <Text style={styles.sectionText}>{achievement[1]}</Text>
                  </View>
                ))}
              </View>
          </View>
  
          {/* Profile History Section */}
          <View style={styles.section}>
              <Text style={styles.sectionTitle}>Profile History</Text>
              <View style={styles.achievementList}>
                {profileInfo.profileHistory.map((historyItem, index) => (
                  <View key={index} style={styles.achievement}>
                    <Text style={styles.achievementTitle}>{historyItem}</Text>
                  </View>
                ))}
              </View>
          </View>
  
          {/* Privacy Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Privacy Settings</Text>
            <View style={styles.privacyToggle}>
              <Text style={styles.sectionContent}>{isPrivate ? 'Private Mode' : 'Public Mode'}</Text>
              <Switch
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={isPrivate ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={togglePrivacy}
                value={isPrivate}
              />
            </View>
          </View>
  
          {/* Sign Out Button */}
          <Pressable
            style={[styles.button, { backgroundColor: '#ff4136', marginTop: 20 }]}
            onPress={handleSignOut}
          >
            <Text style={[styles.buttonText, { color: 'white' }]}>Sign Out</Text>
          </Pressable>

          {/* Delete Account Button */}
          <Pressable
            style={[styles.button, { backgroundColor: '#ff4136', marginTop: 20 }]}
            onPress={() => setIsDeleteAccountModalVisible(true)}
          >
            <Text style={[styles.buttonText, { color: 'white' }]}>Delete Account</Text>
          </Pressable>
        </View>
      </ScrollView>
            {/* Bottom Navigation Bar */}
            <View style={styles.bottomNav}>
        <Pressable 
          style={styles.navItem} 
          onPress={() => navigateToScreen('Map')}
        >
          <MaterialIcons name="map" size={28} color="#666" />
          <Text style={styles.navText}>Map</Text>
        </Pressable>

        <Pressable 
          style={styles.navItem} 
          onPress={() => navigateToScreen('Monument')}
        >
          <MaterialIcons name="star" size={28} color="#666" />
          <Text style={styles.navText}>Monument</Text>
        </Pressable>

        <Pressable 
          style={styles.navItem} 
          onPress={() => navigateToScreen('BadgeFeed')}
        >
          <MaterialIcons name="chat" size={28} color="#666" />
          <Text style={styles.navText}>BadgeFeed</Text>
        </Pressable>

        <Pressable 
          style={styles.navItem} 
          onPress={() => navigateToScreen('Profile')}
        >
          <MaterialIcons name="person" size={28} color="#007AFF" />
          <Text style={[styles.navText, styles.navTextActive]}>Profile</Text>
        </Pressable>
      </View>

  {/* Keep all Modal components here */}
  <ModalPopup
          editable={profileInfo.username}
              visible={isUsernameModalVisible}
              onClose={() => setIsUsernameModalVisible(false)}
              onSave={handleSaveUsername}
          modifyField={"Username"}
      />
      <ModalPopup
          editable={profileInfo.desc}
              visible={isDescriptionModalVisible}
              onClose={() => setIsDescriptionModalVisible(false)}
              onSave={handleSaveDescription}
          modifyField={"Description"}
      />
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
      {/* Delete Account Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isDeleteAccountModalVisible}
        onRequestClose={() => setIsDeleteAccountModalVisible(false)}
      >
        <View style={styles.SignoutCenteredView}>
          <View style={styles.SignoutModalView}>
            <Text style={styles.SignoutModalTitle}>Are you sure you want to delete your account?</Text>
            <Text style={styles.SignoutModalText}>This action cannot be undone.</Text>

            {isPasswordConfirmVisible ? (
              <>
                <Text style={styles.SignoutModalText}>Please enter your password to confirm:</Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    padding: 10,
                    marginTop: 10,
                    borderRadius: 5,
                    backgroundColor: '#fff',
                  }}
                  secureTextEntry={true}
                  placeholder="Enter Password"
                  value={password}
                  onChangeText={setPassword}
                />
                <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Pressable
                    style={[styles.SignoutButton, styles.SignoutButtonOutline]}
                    onPress={() => {
                      setIsDeleteAccountModalVisible(false);
                      setIsPasswordConfirmVisible(false);
                      setPassword('');
                    }}
                  >
                    <Text style={styles.SignoutButtonOutlineText}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.SignoutButton, styles.SignoutButtonFilled, { backgroundColor: '#ff0000' }]}
                    onPress={handleDeleteAccount}
                  >
                    <Text style={styles.SignoutButtonFilledText}>Confirm Delete</Text>
                  </Pressable>
                </View>
              </>
            ) : (
              <View style={styles.SignoutModalButtonContainer}>
                <Pressable
                  style={[styles.SignoutButton, styles.SignoutButtonOutline]}
                  onPress={() => setIsDeleteAccountModalVisible(false)}
                >
                  <Text style={styles.SignoutButtonOutlineText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.SignoutButton, styles.SignoutButtonFilled, { backgroundColor: '#ff0000' }]}
                  onPress={() => setIsPasswordConfirmVisible(true)}
                >
                  <Text style={styles.SignoutButtonFilledText}>Delete Account</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

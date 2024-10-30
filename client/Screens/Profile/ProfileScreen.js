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
        Alert.alert('Success', 'Your account has been deleted.');
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
  
          {/* Description Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.sectionText}>{profileInfo.desc}</Text>
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

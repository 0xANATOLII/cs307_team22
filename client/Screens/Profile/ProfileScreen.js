import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Image, ScrollView, Pressable, Switch, ActivityIndicator, Alert, Platform, TextInput, FlatList } from 'react-native';
import ModalPopup from './Popup';
import styles from '../../styles';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'; // Import the image picker

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
    achievementList: [['Achivement 1','Description of Achievment'],['Achivement 2','Description of Achievment']],
    profileHistory: ['Change 1','Change 2'],
  });
  const [isDeleteAccountModalVisible, setIsDeleteAccountModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

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
            userId: data._id, // Ensure userId is set
            username: data.username,
            pfp: data.pfp ? { uri: data.pfp } : require('./default.png'),
            desc: data.desc || '',
            achievementList: [['Achivement 1','Description of Achievment'],['Achivement 2','Description of Achievment']],
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
      const response = await fetch(`http://localhost:3000/user/updateUsername`, {
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
        const response = await fetch(`http://localhost:3000/user/updatePrivacy`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: profileInfo.userId, isPrivate: newPrivacySetting }), // Send userId instead of username
        });

        const data = await response.json();

        if (response.ok) {
            setIsPrivate(newPrivacySetting);
            console.log('Privacy updated:', data);
        } else {
            console.error('Failed to update privacy:', data);
            Alert.alert('Error', data.message || 'Failed to update privacy setting.');
        }
    } catch (error) {
        console.error('Error updating privacy:', error);
        Alert.alert('Error', 'Could not update privacy setting.');
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

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch('http://localhost:3000/user/deleteAccount', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: profileInfo.username }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Your account has been deleted.');
        navigation.navigate('Home');
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'Failed to delete account. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while deleting the account. Please check your connection and try again.');
    } finally {
      setIsDeleteAccountModalVisible(false);
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
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }





    // Open the camera
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
/*  comment out for now, backend doesnt work
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
  */
    if (loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }

  // Function to handle search input changes
  const handleSearchChange = async (query) => {
    setSearchQuery(query);

    if (query.length > 2) { // Start searching after 3 characters
      try {
        const response = await fetch(`http://localhost:3000/user/search?query=${query}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setSearchResults(data);
        } else {
          Alert.alert('Error', 'Failed to fetch search results.');
        }
      } catch (error) {
        Alert.alert('Error', 'An error occurred while searching.');
      }
    } else {
      setSearchResults([]); // Clear results if query is too short
    }
  };

  // Function to handle search button press
  const handleSearch = async () => {
    if (searchQuery.length > 2) { // Start searching after 3 characters
      try {
        const response = await fetch(`http://localhost:3000/user/search?query=${searchQuery}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setSearchResults(data);
        } else {
          Alert.alert('Error', 'Failed to fetch search results.');
        }
      } catch (error) {
        Alert.alert('Error', 'An error occurred while searching.');
      }
    } else {
      Alert.alert('Error', 'Please enter at least 3 characters to search.');
    }
  };

  return (
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.profileContainer}>
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
  
          {/* Sign Out Button */}
          <Pressable
            style={[styles.button, { backgroundColor: '#ff4136', marginTop: 20 }]}
            onPress={() => setIsSignOutDialogOpen(true)}
          >
            <Text style={[styles.buttonText, { color: 'white' }]}>Sign Out</Text>
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
  
        {/* Delete Account Button */}
        <Pressable
          style={[styles.button, { backgroundColor: '#ff0000', marginTop: 20 }]}
          onPress={() => setIsDeleteAccountModalVisible(true)}
        >
          <Text style={[styles.buttonText, { color: 'white' }]}>Delete Account</Text>
        </Pressable>
  
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
              <View style={styles.SignoutModalButtonContainer}>
                <Pressable
                  style={[styles.SignoutButton, styles.SignoutButtonOutline]}
                  onPress={() => setIsDeleteAccountModalVisible(false)}
                >
                  <Text style={styles.SignoutButtonOutlineText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.SignoutButton, styles.SignoutButtonFilled, { backgroundColor: '#ff0000' }]}
                  onPress={handleDeleteAccount}
                >
                  <Text style={styles.SignoutButtonFilledText}>Delete Account</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        {/* Search Bar */}
        <TextInput
          style={styles.searchBar}
          placeholder="Search for users..."
          value={searchQuery}
          onChangeText={handleSearchChange}
        />

        {/* Search Results */}
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Pressable onPress={() => navigation.navigate('Profile', { username: item.username })}>
              <Text style={styles.searchResultItem}>{item.username}</Text>
            </Pressable>
          )}
        />

        {/* Search Button */}
        <Pressable onPress={handleSearch}>
          <Text style={styles.searchButton}>Search</Text>
        </Pressable>
      </ScrollView>
    );
  }
  
  















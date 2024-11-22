import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Image, ScrollView, Pressable, Switch, ActivityIndicator, TouchableOpacity, Alert, Platform, SafeAreaView, TextInput, FlatList, StyleSheet } from 'react-native';
import ModalPopup from './Popup';
import styles from '../../styles';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Config from "../../config.js";
import BottomNav from '../BottomNav';
import ListPopup from './ListPopup';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { useTheme } from '../../context/ThemeContext'; // Import the theme context
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; // Import icons

export default function ProfileScreen({ route, navigation }) {
  const defaultImageUri = Image.resolveAssetSource(require('./default.png')).uri;
  
  const { username } = route.params;
  const [userId, setUserId] = useState(null);
  const [isUsernameModalVisible, setIsUsernameModalVisible] = useState(false);
  const [isDescriptionModalVisible, setIsDescriptionModalVisible] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [monuments, setMonuments] = useState([]);
  const [isSignOutDialogOpen, setIsSignOutDialogOpen] = useState(false);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [isFollowersModalVisible, setIsFollowersModalVisible] = useState(false);
  const [isFollowingModalVisible, setIsFollowingModalVisible] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [profileInfo, setProfileInfo] = useState({
    username: username,
    pfp: defaultImageUri,
    desc: '',
    followers: 0,
    following: 0,
    badges: [],
    profileHistory: ['Change 1','Change 2'],
  });
  const [isDeleteAccountModalVisible, setIsDeleteAccountModalVisible] = useState(false);
  const [password, setPassword] = useState('');  // New state variable for password input
  const [isPasswordConfirmVisible, setIsPasswordConfirmVisible] = useState(false);  // Controls visibility of password input
  const [recentBadges, setRecentBadges] = useState([]);
  const { isDarkMode, toggleTheme } = useTheme(); // Use the theme context

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch(`${Config.API_URL}/user/id/${username}`);
        if (response.ok) {
          const data = await response.json();
          setUserId(data.userId); // Set the fetched user ID
        } else {
          console.error('Failed to fetch user ID');
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };

    fetchUserId();
  }, [username]);

  useEffect(() => {
    if (!userId) return; // Only fetch if userId is available

    const fetchProfileData = async () => {
      try {
        console.log('Fetching profile data for username:', username);
        const response = await fetch(`${Config.API_URL}/user/profile/${username}`);
        if (response.ok) {
          const data = await response.json();

          const followersDetails = await fetchUserDetails(data.followers || []);
          const followingDetails = await fetchUserDetails(data.following || []);

          setIsPrivate(data.privacy)
          setProfileInfo({
            username: data.username,
            pfp: data.pfp || defaultImageUri,
            desc: data.desc || '',
            followers: followersDetails,
            following: followingDetails,
            badges: data.badges,
            profileHistory: data.profileHistory || [],
          });
          //console.log('Profile data fetched:', data);
          const wishlistResponse = await fetch(`${Config.API_URL}/user/${username}/wishlist`);
          if (wishlistResponse.ok) {
            const wishlistData = await wishlistResponse.json();
            console.log("wishlist loaded:", wishlistData);
            setWishlist(wishlistData.slice(0, 3)); // Only take the first three items
          } else {
            console.error('Failed to fetch wishlist');
          }

          // Fetch recent badges after profile data is loaded
          fetchRecentBadges(userId);
        } else {
          console.error('Failed to load profile data');
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchRecentBadges = async (userId) => {
      try {
        console.log('Fetching recent badges for userId:', userId);
        const response = await fetch(`${Config.API_URL}/badge/recent/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setRecentBadges(data.recentBadges || []);
          console.log('Recent badges fetched:', data.recentBadges);
        } else {
          console.error('Error fetching recent badges');
        }
      } catch (error) {
        console.error('Error fetching recent badges:', error);
      }
    };

    fetchProfileData();
  }, [userId]); // Runs when userId is set


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

  const fetchUserDetails = async (userIds) => {
    try {
  
      // Check if the userIds array is empty
      if (!userIds || userIds.length === 0) {
        console.log('No user IDs provided, skipping fetch');
        return [];
      }
  
      const userDetails = []; // Array to store user details
  
      for (const userId of userIds) {
        
        try {
          const response = await fetch(`${Config.API_URL}/user/allDetails/${userId}`);
          const data = await response.json();
          if (response.ok) {
            userDetails.push(data); // Add user details to the array
          } else {
            console.error(`Failed to fetch details for user ID ${userId}. Server response: ${JSON.stringify(data)}`);
          }
        } catch (error) {
          console.error(`Error fetching details for user ID ${userId}:`, error);
        }
      }

      return userDetails; // Return the array of user details
    } catch (error) {
      console.error('Error fetching user details:', error);
      return [];
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
        body: JSON.stringify({ username, privacy: newPrivacySetting }), // Ensure these match backend expectations
      });
      setIsPrivate(!isPrivate)
      const data = await response.json();
  
      //console.log('Response status:', response.status); // Log status
      //console.log('Response data:', data); // Log data
  
      if (response.ok) {
        console.log('Privacy updated:', data.message);
      } else {
        Alert.alert('Error', data.message || 'Failed to update privacy setting.');
      }
    } catch (error) {
      console.error('Fetch error:', error); // Log fetch errors
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
        Alert.alert('Success', 'Your account has been deleted. You can log back in within 30 seconds to restore your account.');
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

  const imageFromPhone = async () => {
    // No permissions request is necessary for launching the image library
   // setIsUploadModalVisible(false)

   let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 1, // Start with high quality
  });



  
    const compressedImage = await ImageManipulator.manipulateAsync(
      result.assets[0].uri,
      [{ resize: { width: 800 } }], // Adjust width as needed
      { compress: 0.3, format: ImageManipulator.SaveFormat.JPEG } // Adjust compression level
    );

    // Convert to Base64 and store in database
    const base64 = await FileSystem.readAsStringAsync(compressedImage.uri, { encoding: 'base64' });
    const pic = `data:image/jpeg;base64,${base64}`;
  
    const response = await fetch(`${Config.API_URL}/user/updatePfp`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, pfp: pic }),
    });
    
    const responseText = await response.text();
    console.log('Server response:', responseText);
    
    if (response.ok) {
      setProfileInfo((prev) => ({ ...prev, pfp: pic }));
      Alert.alert('Success', 'Profile pic updated successfully!');
    } else {
      Alert.alert('Errorr', `Failed to update profile pic: ${responseText}`);
    }
    
  };

  const getImageSource = (iconPath) => {
    switch (iconPath) {
      case '../assets/belltower.jpg':
        return require('../../assets/belltower.jpg');
      case '../assets/walk.png':
        return require('../../assets/walk.png');
      case '../assets/efountain.jpg':
        return require('../../assets/efountain.jpg');
      case '../assets/purduepete.png':
        return require('../../assets/purduepete.png');
      case '../assets/neil.png':
        return require('../../assets/neil.png');
      case '../assets/pmu.png':
        return require('../../assets/pmu.png');
    }
  };

  useEffect(() => {
    if (wishlist.length === 0) {
      setLoading(false); // Stop loading if wishlist is empty
      return;
    }
    const fetchMonumentDetails = async () => {
      try {
        const monumentDetails = await Promise.all(
          wishlist.map(async (monumentId) => {
            const response = await fetch(`${Config.API_URL}/monument/${monumentId}`);
            if (response.ok) {
              return response.json(); // Return the monument details
            } else {
              console.error(`Failed to fetch monument with ID: ${monumentId}`);
              return null;
            }
          })
        );

        setMonuments(monumentDetails.filter(Boolean)); // Filter out null values
        setLoading(false); // Stop loading once details are fetched
      } catch (error) {
        console.error('Error fetching monument details:', error);
        setLoading(false);
      }
    };

    fetchMonumentDetails();
  }, [wishlist]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDarkMode ? '#121212' : '#FFFFFF' }]}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.profileContainer}>
          {/* Profile Picture Upload */}
          <Pressable onPress={() => imageFromPhone()}>
            <Image
              source={
                profileInfo.pfp
                  ? { uri: profileInfo.pfp }  // Base64 or remote URL
                  : { uri: defaultImageUri }  // Local fallback URI
              }
              style={styles.profilePhoto}
            />
          </Pressable>

          {/* Username */}
          <Text style={styles.title}>{profileInfo.username}</Text>
          <Pressable
            style={[styles.button, { marginTop: 10 }]}
            onPress={() => setIsUsernameModalVisible(true)}
          >
            <Text style={styles.buttonText}>Edit Username</Text>
          </Pressable>

          {/* Theme Toggle Button */}
          <Pressable onPress={toggleTheme} style={[localStyles.themeToggleButton, { backgroundColor: isDarkMode ? '#333' : '#ddd' }]}>
            <Text style={localStyles.themeToggleText}>{isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</Text>
          </Pressable>

          {/* Followers and Following Section */}
          <View style={styles.followContainer}>
            <View style={styles.followCount}>
              <Text style={styles.followCountLabel}>Followers</Text>
              {profileInfo.followers.length > 0 ? (
                <Pressable onPress={() => setIsFollowersModalVisible(true)}>
                  <Text style={styles.followCountNumber}>{profileInfo.followers.length}</Text>
                </Pressable>
              ) : (
                <Text style={styles.followCountNumber}>0</Text>
              )}
            </View>

            <View style={styles.followCount}>
              <Text style={styles.followCountLabel}>Following</Text>
              {profileInfo.following.length > 0 ? (
                <Pressable onPress={() => setIsFollowingModalVisible(true)}>
                  <Text style={styles.followCountNumber}>{profileInfo.following.length}</Text>
                </Pressable>
              ) : (
                <Text style={styles.followCountNumber}>0</Text>
              )}
            </View>
          </View>

          {/* Followers List Popup */}
          <ListPopup
            title="Followers"
            visible={isFollowersModalVisible}
            data={profileInfo.followers}
            navigation={navigation}
            onClose={() => setIsFollowersModalVisible(false)}
          />

          {/* Following List Popup */}
          <ListPopup
            title="Following"
            visible={isFollowingModalVisible}
            data={profileInfo.following}
            navigation={navigation}
            onClose={() => setIsFollowingModalVisible(false)}
          />

  
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
                  value={isPrivate}
                  onValueChange={togglePrivacy}
                  
                />
              </View>
          </View>
  
          {/* Badges Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Badges</Text>
            {recentBadges.length > 0 ? (
              <View style={styles.badgesContainer}>
                {recentBadges.map((badge, index) => {
                  return (
                    <View key={index} style={styles.badge}>
                      <Text style={styles.badgeTitle}>{badge.name}</Text>
                      <TouchableOpacity onPress={() => setIsFlipped(!isFlipped)}>
                        <Image
                          source={{ uri: isFlipped ? badge.picturefUri : badge.pictureUri }}
                          style={localStyles.image}
                        />
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            ) : (
              <Text style={styles.sectionText}>No recent badges</Text>
            )}
          </View>
  
          {/* Wishlist Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Wishlist</Text>
            {wishlist.length > 0 ? (
              <FlatList
              data={monuments}
              keyExtractor={(item) => item._id.toString()}
              renderItem={({ item }) => (
                <View>
                  <Image source={getImageSource(item.icon)} style={styles.icon} />
                  <View style={styles.infoContainer}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.badgeDescription}>
                      {item.description}
                    </Text>
                  </View>
                </View>
              )}
              ListEmptyComponent={<Text style={styles.emptyText}>Your wishlist is empty.</Text>}
              scrollEnabled={false}
              />
            ) : (
              <Text style={styles.sectionText}>No items in wishlist</Text>
            )}
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
      <BottomNav 
        route={route}
        navigation={navigation} 
        username={username} 
        currentScreen={"Profile"}
      />

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

// Add styles for the theme toggle button
const localStyles = StyleSheet.create({
  themeToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  themeToggleText: {
    marginLeft: 10,
  },
  image: {
    width: 120, // Define the width of the image
    height: 120, // Define the height of the image
    borderRadius: 10, // Optional: round the corners
    resizeMode: 'cover', // Optional: control how the image scales
  },
  // ... existing styles ...
});

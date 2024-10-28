import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet, TextInput } from 'react-native';
import axios from 'axios';
import BadgeCommentSection from './BadgeCommentSection'; // Adjust path as needed
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; //Import NavBar Icons
import styles from '../styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import Config from '../config';


export default function BadgeFeedScreen({ route, navigation }) {
  const { username } = route.params;

  // State to track badges, comments, and new badge form
  const [badges, setBadges] = useState([]);
  const [visibleComments, setVisibleComments] = useState({});
  const [newBadge, setNewBadge] = useState({ name: '', picture: '', location: '' });

  // Fetch all badges from the server
  useEffect(() => {
    async function fetchBadges() {
      try {
        const response = await axios.get(`${Config.API_URL}/badge`); // Adjust API URL
        console.log("fetched badges: ", response.data);
        setBadges(response.data);
      } catch (error) {
        console.error('Error fetching badges:', error);
      }
    }
    fetchBadges();
  }, []);

  const navigateToScreen = (screenName) => {
    navigation.navigate(screenName, { username });
  };

  // Create a new badge and update the state
  const createBadge = async (badgeData) => {
    try {
      const badgeDataWithIds = {
        ...badgeData,
        username: username, // Use the passed userId
        monumentId: 'home', // Default value for monumentId
      };
      const response = await axios.post(`${Config.API_URL}/badge/create`, badgeDataWithIds);
      setBadges((prevBadges) => [...prevBadges, response.data]);
    } catch (error) {
      console.error('Error creating badge:', error);
    }
  };

  // Handle badge creation form submission
  const handleCreateBadge = () => {
    if (!newBadge.name) {
      alert('Badge name is required');
      return;
    }

    createBadge(newBadge); // Call the function to create a badge

    // Reset the form
    setNewBadge({ name: '', picture: '', location: '' });
  };

  const handleBadgeLike = async (badgeId) => {
    console.log('Liking badge with ID:', badgeId);
    try {
      const response = await axios.post(`${Config.API_URL}/badge/${badgeId}/like`);
      if (response.status === 200) {
        const updatedBadge = response.data;
        setBadges((prevBadges) =>
          prevBadges.map((badge) => (badge._id === badgeId ? updatedBadge : badge))
        );
      }
    } catch (error) {
      console.error('Error liking badge:', error);
      alert('Error', 'An error occurred while liking the badge');
    }
  };

  const handleBadgeDelete = async (badgeId) => {
    console.log('Deleting badge with ID:', badgeId);
    try {
      const response = await fetch(`${Config.API_URL}/badge/${badgeId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });      
      if (response.ok) {
        // Remove the deleted badge from the local state
        setBadges((prevBadges) => prevBadges.filter((badge) => badge._id !== badgeId));
        alert('Badge deleted successfully');
      } else {
        alert('Failed to delete badge');
      }
    } catch (error) {
      console.error('Error deleting badge:', error);
      alert('An error occurred while deleting the badge');
    }
  };
  

  // Toggle visibility of comments for a specific badge
  const toggleCommentsVisibility = (badgeId) => {
    setVisibleComments((prevState) => ({
      ...prevState,
      [badgeId]: !prevState[badgeId],  // Toggle only the specific badgeId
    }));
  };

  // Render each badge with its name and the username of the creator
  const renderBadge = ({ item }) => {
    // Debugging: Log the entire badge item to inspect its structure
    console.log('Rendering badge item:', item);
    console.log('Badge ID:', item._id); // Specific check for `_id`
  
    return (
      <View style={styles.BSbadgeContainer}>
        <Text style={styles.BSbadgeTitle}>{item.name}</Text>
        <Text style={styles.BSbadgeSubtitle}>
          Created by: {item.userId?.username || 'Unknown'}
        </Text>
  
        {/* Like and Comment Toggle Buttons in a Row */}
        <View style={styles.buttonRow}>
          <Pressable onPress={() => handleBadgeLike(item._id)} style={styles.likeButton}>
            <Text style={styles.likeButtonText}>Like</Text>
          </Pressable>
          <Text style={styles.likeCount}>Likes: {item.likes || 0}</Text>
  
          <Pressable style={styles.BScommentToggleButton} onPress={() => toggleCommentsVisibility(item._id)}>
            <Text style={styles.BScommentToggleText}>
              {visibleComments[item._id] ? 'Hide Comments' : 'See Comments'}
            </Text>
          </Pressable>
        </View>
  
        {/* Display Comments */}
        {visibleComments[item._id] && (
          <BadgeCommentSection key={item._id} badgeId={item._id} username={username} />
        )}
  
        {/* Conditionally render delete button if the logged-in user is the badge creator */}
        {item.userId?.username === username && (
          <Pressable style={styles.BSdeleteButton} onPress={() => handleBadgeDelete(item._id)}>
            <Text style={styles.BSdeleteButtonText}>Delete Badge</Text>
          </Pressable>
        )}
      </View>
    );
  };
  
  
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.BScontainer}>
        {/* Badge Creation Form */}
        <View style={styles.BScreateBadgeContainer}>
          <TextInput
            style={styles.BSinput}
            placeholder="Badge Name"
            value={newBadge.name}
            onChangeText={(text) => setNewBadge({ ...newBadge, name: text })}
          />
          <TextInput
            style={styles.BSinput}
            placeholder="Picture URL"
            value={newBadge.picture}
            onChangeText={(text) => setNewBadge({ ...newBadge, picture: text })}
          />
          <TextInput
            style={styles.BSinput}
            placeholder="Location"
            value={newBadge.location}
            onChangeText={(text) => setNewBadge({ ...newBadge, location: text })}
          />
          <Pressable style={styles.BScreateButton} onPress={handleCreateBadge}>
            <Text style={styles.BScreateButtonText}>Create Badge</Text>
          </Pressable>
        </View>

        {/* List of badges or "No badges" message */}
        {badges.length === 0 ? (
          <Text style={styles.BSnoBadgesText}>No badges available</Text>
        ) : (
          <FlatList
            data={badges}
            keyExtractor={(item, index) => item._id ? item._id : index.toString()}  // Fallback to index if _id is missing
            renderItem={renderBadge}
          />
        )}
      </View>

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
          <MaterialIcons name="chat" size={28} color="#007AFF" />
          <Text style={[styles.navText,styles.navTextActive]}>BadgeFeed</Text>
        </Pressable>

        <Pressable 
          style={styles.navItem} 
          onPress={() => navigateToScreen('Profile')}
        >
          <MaterialIcons name="person" size={28} color="#666" />
          <Text style={styles.navText}>Profile</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
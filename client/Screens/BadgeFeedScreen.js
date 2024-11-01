import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, FlatList, TextInput, ActivityIndicator} from 'react-native';
import axios from 'axios';
import BadgeCommentSection from './BadgeCommentSection'; // Adjust path as needed
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; //Import NavBar Icons
import styles from '../styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import Config from '../config';
import BottomNav from './BottomNav';


export default function BadgeFeedScreen({ route, navigation }) {
  const { username } = route.params;

  // State to track badges, comments, and new badge form
  const [badges, setBadges] = useState([]);
  const [visibleComments, setVisibleComments] = useState({});
  const [newBadge, setNewBadge] = useState({ name: '', picture: '', location: '' });
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all badges from the server

  const fetchBadges = async () => {
    try {
      const response = await axios.get(`${Config.API_URL}/badge`); // Adjust API URL
      setBadges(response.data);
    } catch (error) {
      console.error('Error fetching badges:', error);
    } finally {
      setLoading(false);  // Hide loading indicator
    }
  };

  useEffect(() => {
    fetchBadges();
  }, []);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch(`${Config.API_URL}/user/id/${username}`);
        if (response.ok) {
          const data = await response.json();
          setUserId(data.userId);  // Assuming response includes userId as { userId: '...'}
        } else {
          console.error('Failed to fetch user ID');
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };

    fetchUserId();
  }, [username]);

  // Create a new badge and update the state
  const createBadge = async (badgeData) => {
    try {
      const badgeDataWithIds = {
        ...badgeData,
        username: username, // Use the passed userId
        monumentId: 'home', // Default value for monumentId
      };
      await axios.post(`${Config.API_URL}/badge/create`, badgeDataWithIds);
      await fetchBadges();
    } catch (error) {
      console.error('Error creating badge:', error);
    } finally {
      setLoading(false);
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

  const handleBadgeLikeToggle = async (badgeId) => {
    const badge = badges.find((badge) => badge._id === badgeId);
    const isLiked = badge.likes && badge.likes.some((like) => like.userId === userId);
  
    try {
      let response;
  
      if (isLiked) {
        // Unlike request with axios.delete and userId as a query parameter
        response = await axios.delete(`${Config.API_URL}/badge/${badgeId}/unlike`, {
          data: {userId: userId}, 
        });
      } else {
        // Like request with axios.post
        response = await axios.post(`${Config.API_URL}/badge/${badgeId}/like`, {
          userId: userId, // Ensure userId is available in scope
        });
      }
  
      if (response.status === 200) {
        const updatedBadge = response.data;
  
        // Update badges state with the updated badge
        setBadges((prevBadges) =>
          prevBadges.map((badge) =>
            badge._id === badgeId ? updatedBadge : badge
          )
        );
      }
      await fetchBadges();
    } catch (error) {
      console.error(`Error ${isLiked ? 'unliking' : 'liking'} badge:`, error);
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
    const isLiked = item.likes && item.likes.some((like) => like.userId === userId);
  
    return (
      <View style={styles.BSbadgeContainer}>
        <Text style={styles.BSbadgeTitle}>{item.name}</Text>
        <Text style={styles.BSbadgeSubtitle}>
          Created by: {item.username || 'Unknown'}
        </Text>
  
        <View style={styles.buttonRow}>
          <Pressable onPress={() => handleBadgeLikeToggle(item._id)} style={styles.likeButton}>
            <Text style={styles.likeButtonText}>{isLiked ? 'Unlike' : 'Like'}</Text>
          </Pressable>
          <Text style={styles.likeCount}>Likes: {item.likes ? item.likes.length : 0}</Text>
  
          <Pressable style={styles.BScommentToggleButton} onPress={() => toggleCommentsVisibility(item._id)}>
            <Text style={styles.BScommentToggleText}>
              {visibleComments[item._id] ? 'Hide Comments' : 'See Comments'}
            </Text>
          </Pressable>
        </View>
  
        {visibleComments[item._id] && (
          <BadgeCommentSection key={item._id} badgeId={item._id} username={username} />
        )}
  
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
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : badges.length === 0 ? (
          <Text style={styles.BSnoBadgesText}>No badges available</Text>
        ) : (
          <FlatList
            data={badges}
            keyExtractor={(item, index) => item._id ? item._id : index.toString()}
            renderItem={renderBadge}
          />
        )}
      </View>

      {/* Bottom Navigation Bar */}
      <BottomNav 
        route={route}
        navigation={navigation} 
        username={username} 
        currentScreen={"BadgeFeed"}
      />
    </SafeAreaView>
  );
}
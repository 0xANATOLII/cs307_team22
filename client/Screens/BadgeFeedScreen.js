import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet, TextInput } from 'react-native';
import axios from 'axios';
import BadgeCommentSection from './BadgeCommentSection'; // Adjust path as needed

export default function BadgeFeedScreen({ route }) {
  const { username } = route.params;

  // State to track badges, comments, and new badge form
  const [badges, setBadges] = useState([]);
  const [visibleComments, setVisibleComments] = useState({});
  const [newBadge, setNewBadge] = useState({ name: '', picture: '', location: '' });

  // Fetch all badges from the server
  useEffect(() => {
    async function fetchBadges() {
      try {
        const response = await axios.get('http://localhost:3000/badge'); // Adjust API URL
        setBadges(response.data);
      } catch (error) {
        console.error('Error fetching badges:', error);
      }
    }
    fetchBadges();
  }, []);

  // Create a new badge and update the state
  const createBadge = async (badgeData) => {
    try {
      const badgeDataWithIds = {
        ...badgeData,
        username: username, // Use the passed userId
        monumentId: 'home', // Default value for monumentId
      };
      const response = await axios.post('http://localhost:3000/badge/create', badgeDataWithIds);
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

  // Toggle visibility of comments for a specific badge
  const toggleCommentsVisibility = (badgeId) => {
    setVisibleComments((prevState) => ({
      ...prevState,
      [badgeId]: !prevState[badgeId],
    }));
  };

  // Render each badge with its name and the username of the creator
  const renderBadge = ({ item }) => (
    <View style={styles.badgeContainer}>
      <Text style={styles.badgeTitle}>{item.name}</Text>
  
      {/* Check if item.userId exists before accessing item.userId.username */}
      {item.userId && item.userId.username ? (
        <Text style={styles.badgeSubtitle}>Created by: {item.userId.username}</Text>
      ) : (
        <Text style={styles.badgeSubtitle}>Creator unknown</Text>  // Fallback if userId or username is missing
      )}
  
      {/* Button to toggle comment section */}
      <Pressable
        style={styles.commentToggleButton}
        onPress={() => toggleCommentsVisibility(item._id)}
      >
        <Text style={styles.commentToggleText}>
          {visibleComments[item._id] ? 'Hide Comments' : 'See Comments'}
        </Text>
      </Pressable>
  
      {/* Show comments if visibleComments for the badge is true */}
      {visibleComments[item._id] && (
        <BadgeCommentSection badgeId={item._id} username={username} />
      )}
    </View>
  );
  

  return (
    <View style={styles.container}>
      {/* Badge Creation Form */}
      <View style={styles.createBadgeContainer}>
        <TextInput
          style={styles.input}
          placeholder="Badge Name"
          value={newBadge.name}
          onChangeText={(text) => setNewBadge({ ...newBadge, name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Picture URL"
          value={newBadge.picture}
          onChangeText={(text) => setNewBadge({ ...newBadge, picture: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Location"
          value={newBadge.location}
          onChangeText={(text) => setNewBadge({ ...newBadge, location: text })}
        />
        <Pressable style={styles.createButton} onPress={handleCreateBadge}>
          <Text style={styles.createButtonText}>Create Badge</Text>
        </Pressable>
      </View>

      {/* List of badges or "No badges" message */}
      {badges.length === 0 ? (
        <Text style={styles.noBadgesText}>No badges available</Text>
      ) : (
        <FlatList
          data={badges}
          keyExtractor={(item, index) => item._id ? item._id : index.toString()}  // Fallback to index if _id is missing
          renderItem={renderBadge}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  badgeContainer: {
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  badgeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  badgeSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  commentToggleButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  commentToggleText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  createBadgeContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  createButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
  },
  createButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  noBadgesText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#777',
  },
});

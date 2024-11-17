import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, FlatList, TextInput, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import BadgeCommentSection from './BadgeCommentSection';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Config from '../config';
import BottomNav from './BottomNav';
import { colors, gradients, commonStyles, spacing, borderRadius, typography } from './theme';

// Reusable button components
const GradientButton = ({ onPress, title, style }) => (
  <TouchableOpacity style={[commonStyles.buttonBase, style]} onPress={onPress}>
    <LinearGradient 
      colors={gradients.primary} 
      style={{ ...commonStyles.primaryButton, padding: spacing.md}}
      start={{ x: 0, y: 0 }} 
      end={{ x: 1, y: 0 }}
    >
      <Text style={commonStyles.primaryButtonText}>{title}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

const SecondaryButton = ({ onPress, title, style }) => (
  <TouchableOpacity 
    style={[commonStyles.buttonBase, commonStyles.secondaryButton, {padding: spacing.md}]} 
    onPress={onPress}
  >
    <Text style={commonStyles.secondaryButtonText}>{title}</Text>
  </TouchableOpacity>
);


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
      <View style={styles.badgeCard}>
        <Text style={styles.badgeTitle}>{item.name}</Text>
        <Text style={styles.badgeCreator}>
          Created by: {item.username || 'Unknown'}
        </Text>

        <View style={styles.likeView}>
          <Text style={styles.likeCount}>
              {item.likes ? item.likes.length : 0}
          </Text>
          <MaterialIcons 
                name={isLiked ? 'favorite': 'favorite-border'} 
                size={30} 
                color={isLiked ? colors.primary : colors.inactive} 
          />
        </View>
  
        <View style={styles.badgeActions}>
          <GradientButton
            onPress={() => handleBadgeLikeToggle(item._id)}
            title={isLiked ? 'Unlike' : 'Like'}
            style={styles.actionButton}
          />
          
          <SecondaryButton
            onPress={() => toggleCommentsVisibility(item._id)}
            title={visibleComments[item._id] ? 'Hide Comments' : 'Show Comments'}
            style={styles.actionButton}
          />
        </View>
  
        {visibleComments[item._id] && (
          <BadgeCommentSection key={item._id} badgeId={item._id} username={username} />
        )}
  
        {item.userId?.username === username && (
          <SecondaryButton
            onPress={() => handleBadgeDelete(item._id)}
            title="Delete Badge"
            style={styles.deleteButton}
          />
        )}
      </View>
    );
  };
  
  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={commonStyles.container}>
        {/* Badge Creation Form */}
        <View style={styles.createBadgeForm}>
          <Text style={commonStyles.label}>Create New Badge</Text>
          <TextInput
            style={[commonStyles.input, styles.formInput]}
            placeholder="Badge Name"
            placeholderTextColor={colors.textSecondary}
            value={newBadge.name}
            onChangeText={(text) => setNewBadge({ ...newBadge, name: text })}
          />
          <TextInput
            style={[commonStyles.input, styles.formInput]}
            placeholder="Picture URL"
            placeholderTextColor={colors.textSecondary}
            value={newBadge.picture}
            onChangeText={(text) => setNewBadge({ ...newBadge, picture: text })}
          />
          <TextInput
            style={[commonStyles.input, styles.formInput]}
            placeholder="Location"
            placeholderTextColor={colors.textSecondary}
            value={newBadge.location}
            onChangeText={(text) => setNewBadge({ ...newBadge, location: text })}
          />
          <GradientButton
            onPress={handleCreateBadge}
            title="Create Badge"
            style={styles.createButton}
          />
        </View>

        {/* Badge List */}
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : badges.length === 0 ? (
          <Text style={styles.emptyMessage}>No badges available</Text>
        ) : (
          <FlatList
            data={badges}
            keyExtractor={(item, index) => item._id ? item._id : index.toString()}
            renderItem={renderBadge}
            contentContainerStyle={styles.badgeList}
          />
        )}
      </View>

      <BottomNav 
        route={route}
        navigation={navigation} 
        username={username} 
        currentScreen="BadgeFeed"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  createBadgeForm: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  formInput: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  createButton: {
    marginTop: spacing.md,
  },
  badgeList: {
    padding: spacing.md,
    gap: spacing.md,
  },
  badgeCard: {
    ...commonStyles.card,
    position: 'relative',
    marginBottom: spacing.sm,
  },
  badgeTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  badgeCreator: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  badgeActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  likeView: {
    position: 'absolute',
    top: 5,
    right: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeCount: {
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
    fontWeight: typography.weights.medium,
  },
  deleteButton: {
    marginTop: spacing.md,
  },
  emptyMessage: {
    fontSize: typography.sizes.lg,
    color: colors.textSecondary,
    textAlign: 'center',
    padding: spacing.xl,
  },
});
import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, FlatList, ActivityIndicator, Alert, TextInput } from 'react-native';
import axios from 'axios';
import styles from '../styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import Config from '../config';
import BottomNav from './BottomNav';

export default function FriendsPage({ route, navigation }) {
  const { username } = route.params;
  const [userId, setUserId] = useState(null);
  const [friendRequests, setFriendRequests] = useState([]);
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Fetch User ID
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await axios.get(`${Config.API_URL}/user/id/${username}`);
        if (response.status === 200) {
          setUserId(response.data.userId);
        } else {
          console.error('Failed to fetch user ID');
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };
    fetchUserId();
  }, [username]);

  // Fetch Friend Requests and Recommended Users
  const fetchFriendData = async () => {
    try {
      setLoading(true);
      // Fetch pending friend requests
      const requestsResponse = await axios.get(`${Config.API_URL}/friends/requests/${userId}`);
      setFriendRequests(requestsResponse.data);

      // Fetch recommended users based on badge count
      const recommendationsResponse = await axios.get(`${Config.API_URL}/users/recommended`);
      setRecommendedUsers(recommendationsResponse.data);
    } catch (error) {
      console.error('Error fetching friend data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchFriendData();
  }, [userId]);

  // Accept or Reject a Friend Request
  const handleRequest = async (requestId, action) => {
    try {
      await axios.post(`${Config.API_URL}/friends/${action}/${requestId}`);
      fetchFriendData(); // Refresh data after accepting/rejecting
    } catch (error) {
      console.error(`Error ${action} friend request:`, error);
    }
  };

  // Follow a Recommended User
  const handleFollowRequest = async (targetUserId, isPrivate) => {
    try {
      if (isPrivate) {
        // Send follow request if user profile is private
        await axios.post(`${Config.API_URL}/friends/request`, { userId, targetUserId });
        Alert.alert('Request Sent', 'Your follow request has been sent.');
      } else {
        // Auto-follow if profile is public
        await axios.post(`${Config.API_URL}/friends/accept`, { userId, targetUserId });
        Alert.alert('Followed', 'You are now following this user.');
      }
      fetchFriendData(); // Refresh friend data
    } catch (error) {
      console.error('Error sending follow request:', error);
    }
  };

  // Handle User Search
  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${Config.API_URL}/users/search?query=${searchQuery}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Render Friend Request Item
  const renderFriendRequest = ({ item }) => (
    <View style={styles.requestContainer}>
      <Text>{item.username} has sent you a follow request.</Text>
      <View style={styles.requestActions}>
        <Pressable onPress={() => handleRequest(item._id, 'accept')}>
          <Text style={styles.acceptButton}>Accept</Text>
        </Pressable>
        <Pressable onPress={() => handleRequest(item._id, 'reject')}>
          <Text style={styles.rejectButton}>Reject</Text>
        </Pressable>
      </View>
    </View>
  );

  // Render Recommended User Item
  const renderRecommendedUser = ({ item }) => (
    <View style={styles.recommendContainer}>
      <Text>{item.username}</Text>
      <Text>Badges: {item.badgeCount}</Text>
      <Pressable
        onPress={() => handleFollowRequest(item.userId, item.isPrivate)}
        style={styles.followButton}
      >
        <Text>{item.isPrivate ? 'Request to Follow' : 'Follow'}</Text>
      </Pressable>
    </View>
  );

  // Render Search Result Item
  const renderSearchResult = ({ item }) => (
    <View style={styles.searchResultContainer}>
      <Text>{item.username}</Text>
      <Text>Badges: {item.badgeCount}</Text>
      <Pressable
        onPress={() => handleFollowRequest(item.userId, item.isPrivate)}
        style={styles.followButton}
      >
        <Text>{item.isPrivate ? 'Request to Follow' : 'Follow'}</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for users..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Pressable style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Search</Text>
          </Pressable>
        </View>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <>
            <Text style={styles.header}>Search Results</Text>
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.userId}
              renderItem={renderSearchResult}
            />
          </>
        )}

        {/* Friend Requests */}
        <Text style={styles.header}>Friend Requests</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : friendRequests.length > 0 ? (
          <FlatList
            data={friendRequests}
            keyExtractor={(item) => item._id}
            renderItem={renderFriendRequest}
          />
        ) : (
          <Text>No friend requests</Text>
        )}

        {/* Recommended Users */}
        <Text style={styles.header}>Recommended Users</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : recommendedUsers.length > 0 ? (
          <FlatList
            data={recommendedUsers}
            keyExtractor={(item) => item.userId}
            renderItem={renderRecommendedUser}
          />
        ) : (
          <Text>No recommended users</Text>
        )}
      </View>

      <BottomNav 
        route={route}
        navigation={navigation} 
        username={username} 
      />
    </SafeAreaView>
  );
}

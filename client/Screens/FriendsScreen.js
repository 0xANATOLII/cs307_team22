import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, FlatList, ActivityIndicator } from 'react-native';
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
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

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
      const requestsResponse = await axios.get(`${Config.API_URL}/friends/requests/${userId}`);
      setFriendRequests(requestsResponse.data);

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

  // Search users based on query
  const handleSearch = async () => {
    try {
      setLoading(true);
      console.log("search query:", searchQuery);
      const response = await axios.get(`${Config.API_URL}/user/search/${searchQuery}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Accept or Reject a Friend Request
  const handleRequest = async (requestId, action) => {
    try {
      await axios.post(`${Config.API_URL}/friends/${action}/${requestId}`);
      fetchFriendData();
    } catch (error) {
      console.error(`Error ${action} friend request:`, error);
    }
  };

  // Follow a Recommended User
  const handleFollowRequest = async (targetUserId, isPrivate) => {
    try {
      if (isPrivate) {
        await axios.post(`${Config.API_URL}/friends/request`, { userId, targetUserId });
        alert('Follow request sent.');
      } else {
        await axios.post(`${Config.API_URL}/friends/accept`, { userId, targetUserId });
        alert('Followed successfully.');
      }
      fetchFriendData();
    } catch (error) {
      console.error('Error sending follow request:', error);
    }
  };

  // Render Friend Request Item
  const renderFriendRequest = ({ item }) => (
    <View style={styles.requestContainer}>
      <Text>{item.username} has sent you a follow request.</Text>
      <View style={styles.requestActions}>
        <Pressable onPress={() => handleRequest(item._id, 'accept')} style={styles.acceptButton}>
          <Text>Accept</Text>
        </Pressable>
        <Pressable onPress={() => handleRequest(item._id, 'reject')} style={styles.rejectButton}>
          <Text>Reject</Text>
        </Pressable>
      </View>
    </View>
  );

  // Render Recommended User or Search Result Item
  const renderUserItem = ({ item }) => (
    <View style={styles.recommendContainer}>
      <Text>{item.username}</Text>
      <Pressable onPress={() => handleFollowRequest(item.id, item.isPrivate)} style={styles.followButton}>
        <Text>{item.isPrivate ? 'Request to Follow' : 'Follow'}</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.BScontainer}>
        {/* Search Input */}
        <TextInput
          style={styles.BSinput}
          placeholder="Search users"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Pressable style={styles.BScreateButton} onPress={handleSearch}>
          <Text style={styles.BScreateButtonText}>Search</Text>
        </Pressable>

        {/* Friend Requests */}
        <Text style={styles.BSsectionHeader}>Friend Requests</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : friendRequests.length === 0 ? (
          <Text style={styles.BSnoBadgesText}>No friend requests</Text>
        ) : (
          <FlatList
            data={friendRequests}
            keyExtractor={(item) => item._id}
            renderItem={renderFriendRequest}
          />
        )}

        {/* Recommended Users or Search Results */}
        <Text style={styles.BSsectionHeader}>
          {searchQuery ? 'Search Results' : 'Recommended Users'}
        </Text>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (searchQuery ? searchResults : recommendedUsers).length === 0 ? (
          <Text style={styles.BSnoBadgesText}>No users found</Text>
        ) : (
          <FlatList
            data={searchQuery ? searchResults : recommendedUsers}
            keyExtractor={(item) => item.id}
            renderItem={renderUserItem}
          />
        )}
      </View>

      <BottomNav route={route} navigation={navigation} username={username} currentScreen="Friends" />
    </SafeAreaView>
  );
}

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
  const [followingUsers, setFollowingUsers] = useState([]);

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

  const fetchFollowingUsers = async () => {
    try {
      const response = await axios.get(`${Config.API_URL}/user/${userId}/following`);
      setFollowingUsers(response.data); // response.data should be an array of user IDs
    } catch (error) {
      console.error('Error fetching following users:', error);
    }
  };

  // Fetch Friend Requests and Recommended Users
  const fetchFriendData = async () => {
    try {
      setLoading(true);
      const requestsResponse = await axios.get(`${Config.API_URL}/user/${userId}/requests`);
      if (requestsResponse.data.length === 0) {
        setFriendRequests([]); // Set empty array if no requests
      } else {
        setFriendRequests(requestsResponse.data); // Otherwise, set fetched data
        console.log(requestsResponse.data)
      }
    console.log("trying to see search queery");
      if (searchQuery.trim() === "") {
        const recommendationsResponse = await axios.get(`${Config.API_URL}/user/${userId}/recommended`);
        const filteredRecommendations = recommendationsResponse.data.filter(user => user.id !== userId); // Exclude current user
        setRecommendedUsers(filteredRecommendations);
      } else {
        setRecommendedUsers([]); // Clear recommended users when searching
      }
    } catch (error) {
        console.error('Error fetching friend data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchFriendData();
      fetchFollowingUsers();
    }
  }, [userId]);

  // Search users based on query
  const handleSearch = async () => {
    try {
      setLoading(true);
      console.log("search query:", searchQuery);
  
      if (searchQuery.trim() === "") {
        // If search query is empty, show recommended users instead
        console.log("empoty search!");
        const recommendationsResponse = await axios.get(`${Config.API_URL}/user/${userId}/recommended`);
        setRecommendedUsers(recommendationsResponse.data);
        setSearchResults([]); // Clear search results

      } else {
        // Perform the search if there is a valid query
        const response = await axios.get(`${Config.API_URL}/user/search/${searchQuery}`);
        const filteredResults = response.data.filter(user => user.username !== username);
        setSearchResults(filteredResults);
        setRecommendedUsers([]); // Clear recommended users when searching
      }
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setLoading(false);
    }
  };
  

  // Accept or Reject a Friend Request
  const handleRequest = async (requestId, action) => {
    try {
      if (action === 'acceptRequest') {
        await axios.post(`${Config.API_URL}/user/acceptRequest`, { userId, targetUserId: requestId });
        alert('Friend request accepted.');
        setFriendRequests(friendRequests.filter(request => request._id !== requestId));
      } else if (action === 'reject') {
        await axios.post(`${Config.API_URL}/user/reject`, { userId, targetUserId: requestId });
        alert('Friend request rejected.');
        setFriendRequests(friendRequests.filter(request => request._id !== requestId));
      } else {
        console.error('Invalid action specified');
      }
      fetchFriendData(); // Refresh friend requests after the action
    } catch (error) {
      console.error(`Error handling friend request: ${action}`, error);
    }
  };
  

  // Render Friend Request Item
  const renderFriendRequest = ({ item }) => (
    <View style={[styles.requestContainer, { flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 8, backgroundColor: '#f8f9fa', marginVertical: 6 }]}>
      <Text style={[styles.requestText, { fontSize: 16, color: '#333', flex: 1, marginRight: 10 }]}>
        {item.username} has sent you a follow request.
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Pressable onPress={() => handleRequest(item.id, 'acceptRequest')} style={[styles.acceptButton, { backgroundColor: '#28a745', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6, marginRight: 8 }]}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Accept</Text>
        </Pressable>
        <Pressable onPress={() => handleRequest(item.id, 'reject')} style={[styles.rejectButton, { backgroundColor: '#dc3545', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 }]}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Reject</Text>
        </Pressable>
      </View>
    </View>
  );
  

  // Follow and unfollow toggling
  const handleFollowToggle = async (targetUserId, isPrivate) => {
    try {
      if (followingUsers.includes(targetUserId)) {
        await axios.post(`${Config.API_URL}/user/${userId}/unfollow`, { userId, targetUserId });
        alert('Unfollowed successfully.');
      } else {
        if (isPrivate) {
          await axios.post(`${Config.API_URL}/user/request`, { userId, targetUserId });
          alert('Follow request sent.');
        } else {
          await axios.post(`${Config.API_URL}/user/follow`, { userId, targetUserId });
          setFollowingUsers([...followingUsers, targetUserId]);
          alert('Followed successfully.');
        }
      }
      fetchFollowingUsers(); // Refresh following data
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    }
  };

  // Render Recommended User or Search Result Item
  const renderUserItem = ({ item }) => {
    const isFollowing = followingUsers.includes(item.id); // Check if already following

    return (
      <View style={styles.userItemContainer}>
        <Text style={styles.usernameText}>{item.username}</Text>
        <Pressable
          onPress={() => handleFollowToggle(item.id, item.privacy)}
          style={isFollowing ? styles.unfollowButton : styles.followButton}
        >
          <Text style={styles.followButtonText}>{isFollowing ? 'Unfollow' : item.privacy ? 'Request to Follow' : 'Follow'}</Text>
        </Pressable>
      </View>
    );
  };

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

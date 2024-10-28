import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, FlatList, StyleSheet, Alert } from 'react-native';
import Config from '../config';

export default function RequestsPage({ username }) {
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    // Fetch incoming friend requests
    const fetchIncomingRequests = async () => {
      try {
        const response = await fetch(`${Config.API_URL}/user/incoming-requests/${username}`);
        const data = await response.json();
        setIncomingRequests(data);
      } catch (error) {
        Alert.alert('Error', 'Failed to load incoming requests');
      }
    };

    fetchIncomingRequests();
  }, [username]);

  const handleSearch = async () => {
    if (searchQuery.length < 3) {
      Alert.alert('Error', 'Please enter at least 3 characters to search.');
      return;
    }

    try {
      const response = await fetch(`${Config.API_URL}/user/search?query=${searchQuery}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to search users');
    }
  };

  const sendFriendRequest = async (userId) => {
    try {
      const response = await fetch(`${Config.API_URL}/user/send-friend-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Friend request sent!');
      } else {
        Alert.alert('Error', 'Failed to send friend request');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while sending the friend request');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Incoming Follow Requests</Text>
      <FlatList
        data={incomingRequests}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.requestItem}>
            <Text>{item.username}</Text>
            <Pressable onPress={() => sendFriendRequest(item._id)}>
              <Text style={styles.requestButton}>Accept</Text>
            </Pressable>
          </View>
        )}
      />

      <TextInput
        style={styles.input}
        placeholder="Search for users..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
      />

      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.searchResultItem}>
            <Text>{item.username}</Text>
            <Pressable onPress={() => sendFriendRequest(item.id)}>
              <Text style={styles.requestButton}>Request Friend</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  requestItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  requestButton: {
    color: '#007AFF',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  searchResultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

import React, { useState } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import BadgeCommentSection from './BadgeCommentSection'; // Adjust path as needed

export default function BadgeFeedScreen({ badges, username }) {
  // Track which badge's comment section is open
  const [visibleComments, setVisibleComments] = useState({});

  // Toggle visibility of comments for a specific badge
  const toggleCommentsVisibility = (badgeId) => {
    setVisibleComments((prevState) => ({
      ...prevState,
      [badgeId]: !prevState[badgeId],
    }));
  };

  // Render each badge with a "See Comments" button
  const renderBadge = ({ item }) => (
    <View style={styles.badgeContainer}>
      <Text style={styles.badgeTitle}>{item.name}</Text>

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
    <FlatList
      data={badges}
      keyExtractor={(item) => item._id}
      renderItem={renderBadge}
    />
  );
}

const styles = StyleSheet.create({
  badgeContainer: {
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  badgeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
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
});

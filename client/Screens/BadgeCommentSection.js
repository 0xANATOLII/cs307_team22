import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, FlatList, StyleSheet, Alert } from 'react-native';

export default function BadgeCommentSection({ badgeId, username }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  // Fetch comments for the specific badge
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`${Config.API_URL}/badge/${badgeId}/comments`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setComments(data);
        } else {
          alert('Error', 'Failed to load comments');
        }
      } catch (error) {
        alert('Error', 'An error occurred while loading comments');
      }
    };

    fetchComments();
  }, [badgeId]);

  // Submit new comment
  const handleCommentSubmit = async () => {
    if (newComment.length > 200) {
      alert('Error', 'Comment exceeds character limit of 200.');
      return;
    }
    if (newComment.trim() === '') {
      alert('Error', 'Comment cannot be empty.');
      return;
    }

    try {
      const response = await fetch(`${Config.API_URL}/badge/${badgeId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'userId_here', // Replace with actual user ID
          commentText: newComment,
        }),
      });

      if (response.ok) {
        const newCommentData = await response.json();
        setComments([...comments, newCommentData]);
        setNewComment('');
        alert('Success', 'Comment added!');
      } else {
        alert('Error', 'Failed to submit comment');
      }
    } catch (error) {
      alert('Error', 'An error occurred while submitting the comment');
    }
  };

  // Delete comment
  const handleCommentDelete = async (commentId) => {
    try {
      const response = await fetch(`${Config.API_URL}/badge/${badgeId}/comment/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setComments(comments.filter((comment) => comment._id !== commentId));
        alert('Success', 'Comment deleted.');
      } else {
        alert('Error', 'Failed to delete comment');
      }
    } catch (error) {
      alert('Error', 'An error occurred while deleting the comment');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Comments</Text>
      
      {/* Comment List */}
      <FlatList
        data={comments}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.comment}>
            <Text style={styles.commentUser}>{item.username}</Text>
            <Text style={styles.commentText}>{item.comment}</Text>
            {item.username === username && (
              <Pressable onPress={() => handleCommentDelete(item._id)}>
                <Text style={styles.deleteButton}>Delete</Text>
              </Pressable>
            )}
          </View>
        )}
      />

      {/* Comment Input */}
      <TextInput
        style={styles.input}
        value={newComment}
        onChangeText={setNewComment}
        placeholder="Add a comment..."
        maxLength={200}
      />
      <Text style={styles.charLimit}>Character limit: {newComment.length}/200</Text>

      {/* Submit Button */}
      <Pressable style={styles.submitButton} onPress={handleCommentSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#fff',
    flex: 1,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  comment: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  commentUser: {
    fontWeight: 'bold',
  },
  commentText: {
    marginTop: 5,
  },
  deleteButton: {
    color: '#ff0000',
    marginTop: 5,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  charLimit: {
    textAlign: 'right',
    color: '#888',
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

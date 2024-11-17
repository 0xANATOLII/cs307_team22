import React, { useState, useEffect } from 'react';
import {View,Text,TextInput,Modal,TouchableOpacity,StyleSheet,Dimensions,Pressable,FlatList} from 'react-native';
import Config from '../config';
import { colors, typography, spacing, borderRadius } from './theme';

const { height, width } = Dimensions.get('window');

export default function BadgeCommentSection({ badgeId, username, visible, onClose }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [userId, setUserId] = useState(null);

  // Existing fetch comments logic
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
        alert('Error Failed to load comments');
      }
    } catch (error) {
      alert('Error An error occurred while loading comments');
    }
  };

  useEffect(() => {
    fetchComments();
  }, [badgeId]);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch(`${Config.API_URL}/user/id/${username}`);
        if (response.ok) {
          const data = await response.json();
          setUserId(data.userId);
        } else {
          console.error('Failed to fetch user ID');
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };

    fetchUserId();
  }, [username]);

  // Existing comment submission logic
  const handleCommentSubmit = async () => {
    if (newComment.length > 200) {
      alert('Error: Comment exceeds character limit of 200.');
      return;
    }
    if (newComment.trim() === '') {
      alert('Error Comment cannot be empty.');
      return;
    }

    try {
      const response = await fetch(`${Config.API_URL}/badge/${badgeId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          commentText: newComment,
          username: username,
        }),
      });

      if (response.ok) {
        const newCommentData = await response.json();
        setComments([...comments, newCommentData]);
        setNewComment('');
        alert('Success Comment added!');
      } else {
        alert('Error Failed to submit comment');
      }
      await fetchComments();
    } catch (error) {
      alert('Error An error occurred while submitting the comment');
    }
  };

  // Existing delete comment logic
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
        alert('Error Failed to delete comment');
      }
      await fetchComments();
    } catch (error) {
      alert('Error An error occurred while deleting the comment');
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <Pressable style={styles.blurredBackground} onPress={onClose} />
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Comments</Text>
          
          <FlatList
            data={comments}
            style={styles.commentList}
            keyExtractor={(item, index) => (item._id ? item._id.toString() : `comment-${index}`)}
            renderItem={({ item }) => (
              <View style={styles.comment}>
                <Text style={styles.commentUser}>{item.username || 'Unknown'}</Text>
                <Text style={styles.commentText}>{item.commentText || 'No content'}</Text>
                {item.username === username && (
                  <TouchableOpacity onPress={() => handleCommentDelete(item._id)}>
                    <Text style={styles.deleteButton}>Delete</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          />

          <View style={styles.inputSection}>
            <TextInput
              style={styles.input}
              value={newComment}
              onChangeText={setNewComment}
              placeholder="Add a comment..."
              placeholderTextColor={colors.textSecondary}
              maxLength={200}
            />
            <Text style={styles.charLimit}>
              {`${newComment.length}/200 characters`}
            </Text>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.closeButton]}
                onPress={onClose}
              >
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.submitButton]}
                onPress={handleCommentSubmit}
              >
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  blurredBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: height * 0.8,
    width: width,
  },
  modalText: {
    marginBottom: spacing.md,
    textAlign: 'center',
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  commentList: {
    width: '100%',
    flex: 1,
  },
  comment: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  commentUser: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
  },
  commentText: {
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  deleteButton: {
    color: '#FF6347',
    marginTop: spacing.xs,
    fontSize: typography.sizes.sm,
  },
  inputSection: {
    width: '100%',
    marginTop: spacing.md,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: typography.sizes.md,
  },
  charLimit: {
    textAlign: 'right',
    color: colors.textSecondary,
    fontSize: typography.sizes.sm,
    marginTop: spacing.xs,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  button: {
    flex: 1,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginHorizontal: spacing.xs,
    elevation: 2,
  },
  closeButton: {
    backgroundColor: '#FF6347',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: colors.textPrimary,
    fontWeight: typography.weights.bold,
    textAlign: 'center',
    fontSize: typography.sizes.md,
  },
});
import { GestureDetector, Gesture, FlatList, TextInput } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { View, Text, Modal, StyleSheet, Dimensions, TouchableOpacity,Image } from 'react-native';
import { runOnJS } from 'react-native-reanimated';
import axios from 'axios';
import { useState } from 'react';
import Config from '../../config';

const { height } = Dimensions.get('window');

const CommentsSection = ({ visible, setVisible, comments,setcomments,badgeid,userId,username,userpfp}) => {
  const defaultImageUri = Image.resolveAssetSource(require('../Profile/default.png')).uri;

  const [comment, setComment] = useState('');
  const translateY = useSharedValue(height * 0.3);

  
  const openThreshold = height * 0.2; 

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
        // Clamp translateY between 0 (fully open) and height (fully closed)
       
        translateY.value = Math.min(height, Math.max(0, height * 0.3 + e.translationY));
      })      
      .onEnd((e) => {
        if (e.translationY < -openThreshold) {
            console.log("Opening to 100%");
          // If dragged up past the threshold, open to 100% height
          translateY.value = withSpring(0); // Fully open
        } else if (e.translationY > height * 0.5) {

            console.log("Closing panel");
          
          translateY.value = withSpring(height, {}, () => {
         
            runOnJS(setVisible)(false);
          });
          //onClose();
        } else {
            console.log("Returning to 70%");
          // Otherwise, snap back to 70% height
          translateY.value = withSpring(height * 0.3);
        }
      })

  if (!visible) return (<View></View>);

  const postComment = async() =>{

    console.log({
      badgeId:badgeid,
      userId:userId,
      commentText:comment,
      username:username,
    })
   const resp = axios.post(`${Config.API_URL}/badge/${badgeid}/comment`, {
    userId:userId,
    commentText:comment,
    username:username,
  }).catch(
    console.log
   )

  }



  const handleSend = async () => {
    if (comment.trim()) {
      setcomments([...comments, comment]);

      await postComment();      
      setComment(''); // Clear the input field

    }
  };
  console.log(comments)

  

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.container, animatedStyle]}>
            <View style={styles.header}>
              <Text style={styles.handle} />
              <Text style={styles.title}>Comments</Text>
            </View>
            
          { comments == 0 &&(
             <Text style={styles.comment}>This is where comments will go...</Text>
          )}
           



           <View style={stylesCom.inputContainer}>
          <TextInput
            style={stylesCom.input}
            placeholder="Add a comment..."
            value={comment}
            onChangeText={setComment}
          />
          <TouchableOpacity style={stylesCom.sendButton} onPress={handleSend}>
            <Text style={stylesCom.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>

          
            <FlatList
        data={comments}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) =>
          item.username === username ? (
            <View style={stylesCom.commentBubbleCust}>
              <Text>{item.commentText} |{item.username} 


              <Image
              source={{uri:`${Config.API_URL}/user/pfp/${item.username}`}}
              style={{  }}
              resizeMode="cover"
            />
            
              </Text>
            </View>
          ) : 
          <View style={stylesCom.commentBubble}>
          <Text>{item.commentText} |{item.username}
          <Image
              source={{
                  uri:`${Config.API_URL}/user/pfp/${item.username}`
              }
              }
              style={{  }}
               resizeMode="cover"
            />

          </Text>
          </View>

        }

        contentContainerStyle={stylesCom.commentsList}
      />
         
          
      
          

          </Animated.View>
        </GestureDetector>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 2.5,
    marginBottom: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  comment: {
    padding: 20,
    fontSize: 14,
    color: '#333',
  },
});
const stylesCom = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  commentsList: {
    padding: 16,
  },
  commentBubble: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  commentBubbleCust: {
    backgroundColor: '#CEB888',
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CommentsSection;

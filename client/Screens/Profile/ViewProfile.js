import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Image, ScrollView, Pressable, Switch, ActivityIndicator, Alert, Platform, SafeAreaView, TextInput } from 'react-native';
import ModalPopup from './Popup';
import styles from '../../styles';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Config from "../../config.js";
import BottomNav from '../BottomNav';
import ListPopup from './ListPopup';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';

export default function ViewProfile({ route, navigation }) {
    const { user } = route.params;
    const [isFollowersModalVisible, setIsFollowersModalVisible] = useState(false);
    const [isFollowingModalVisible, setIsFollowingModalVisible] = useState(false);
    console.log("user issss" + user)
    console.log("User name iss" + user.username);
    console.log("user desc is " + user.description)
    const defaultImageUri = Image.resolveAssetSource(require('./default.png')).uri;


    
    return (
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>

            <View style={styles.profileContainer}>
            <Image
              source={
                user.pfp
                  ? { uri: user.pfp }  // Base64 or remote URL
                  : { uri: defaultImageUri }  // Local fallback URI
              }
              style={styles.profilePhoto}
            />
      
              {/* Username */}
              <Text style={styles.title}>{user.username}</Text>

                           {/* Followers and Following Section */}
             <View style={styles.followContainer}>
             <View style={styles.followCount}>
               <Text style={styles.followCountLabel}>Followers</Text>
               {user.followers.length > 0 ? (
                   <Text style={styles.followCountNumber}>{user.followers.length}</Text>
               ) : (
                 <Text style={styles.followCountNumber}>0</Text>
               )}
             </View>
   
             <View style={styles.followCount}>
               <Text style={styles.followCountLabel}>Following</Text>
               {user.following.length > 0 ? (
                   <Text style={styles.followCountNumber}>{user.following.length}</Text>
               ) : (
                 <Text style={styles.followCountNumber}>0</Text>
               )}
             </View>
           </View>
   
           {/* Followers List Popup */}
           <ListPopup
             title="Followers"
             visible={isFollowersModalVisible}
             data={user.followers}
             navigation={navigation}
             onClose={() => setIsFollowersModalVisible(false)}
           />
   
           {/* Following List Popup */}
           <ListPopup
             title="Following"
             visible={isFollowingModalVisible}
             data={user.following}
             navigation={navigation}
             onClose={() => setIsFollowingModalVisible(false)}
           />
   
           {/* Description Section */}
           <View style={styles.section}>
             <Text style={styles.sectionTitle}>Description</Text>
             <Text style={styles.sectionText}>{user.description}</Text>
           </View>
   
            {/* Close Button */}
            <Pressable 
            onPress={() => navigation.goBack()} 
            style={styles.button}
            >
            <MaterialIcons name="close"/>
            <Text style={styles.buttonText}>Close</Text>
            </Pressable>
            </View>
        </ScrollView>
    </SafeAreaView>
      );
    }      
  
  
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
    console.log("User name is" + user.username);
    const defaultImageUri = Image.resolveAssetSource(require('./default.png')).uri;


    
    return (
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            {/* Close Button */}
        <Pressable 
          onPress={() => navigation.goBack()} 
          style={styles.closeButton}
        >
          <MaterialIcons name="close" size={24} color="black" />
          <Text style={styles.closeButtonText}>Close</Text>
        </Pressable>
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

      
 
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    }      
  
  
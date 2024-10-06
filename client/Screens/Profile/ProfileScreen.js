//screens/ProfileScreen.js
import React, { useState } from 'react';
import { Modal, View, Text, Image, TextInput, ScrollView, StyleSheet, Button } from 'react-native';
import ModalPopup from './Popup';

export default function ProfileScreen({ navigation }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  //const [username, setUsername] = useState('');
  let profileInfo = new Object();
  profileInfo.username = "JohnDoe123"
  profileInfo.pfp = require('./purduepete.png');
  profileInfo.desc = "Hi there! I'm John, a passionate developer and tech enthusiast. I love creating apps and exploring new technologies. When I'm not coding, you can find me hiking or reading sci-fi novels.";

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={profileInfo.pfp}
          style={styles.profilePhoto}
        />
        <Text style={styles.username}>{profileInfo.username}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.sectionContent}>
          {profileInfo.desc}
        </Text>
        <Button title="Edit Description" onPress={() => setIsModalVisible(true)} />
        <ModalPopup editable={profileInfo.desc} visible={isModalVisible} onClose={() => setIsModalVisible(false)}></ModalPopup>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        <View style={styles.achievementList}>
          <View style={styles.achievement}>
            <Text style={styles.achievementTitle}>Master Coder</Text>
            <Text style={styles.achievementDesc}>Completed 100 coding challenges</Text>
          </View>
          <View style={styles.achievement}>
            <Text style={styles.achievementTitle}>Bug Squasher</Text>
            <Text style={styles.achievementDesc}>Fixed 50 critical bugs</Text>
          </View>
          <View style={styles.achievement}>
            <Text style={styles.achievementTitle}>Team Player</Text>
            <Text style={styles.achievementDesc}>Contributed to 10 open-source projects</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  profilePhoto: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: '#ffffff',
    marginTop: 20,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 16,
    lineHeight: 24,
  },
  achievementList: {
    marginTop: 10,
  },
  achievement: {
    marginBottom: 15,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  achievementDesc: {
    fontSize: 14,
    color: '#666',
  },
});
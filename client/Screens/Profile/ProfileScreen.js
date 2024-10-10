import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, Pressable, Switch, ActivityIndicator, Alert } from 'react-native';
import ModalPopup from './Popup';
import styles from '../../styles';

export default function ProfileScreen({ route, navigation }) {
  const { username } = route.params;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileInfo, setProfileInfo] = useState({
    username: username,
    pfp: null,
    desc: '',
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/user/profile/${username}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProfileInfo({
            username: data.username,
            pfp: data.pfp ? { uri: data.pfp } : require('./purduepete.png'),
            desc: data.desc || '',
          });
          setIsPrivate(data.privacy);
        } else {
          Alert.alert('Error', 'Failed to load profile data.');
        }
      } catch (error) {
        Alert.alert('Error', 'Unable to fetch profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleSaveDescription = async (newDescription) => {
    try {
      const response = await fetch(`http://localhost:3000/user/updateDescription`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, description: newDescription }),
      });

      if (response.ok) {
        setProfileInfo((prev) => ({ ...prev, desc: newDescription }));
        Alert.alert('Success', 'Description updated successfully!');
      } else {
        Alert.alert('Error', 'Failed to update description');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while updating the description.');
    }
  };

  const togglePrivacy = async () => {
    const newPrivacySetting = !isPrivate;
    setIsPrivate(newPrivacySetting);

    try {
      const response = await fetch('http://localhost:3000/user/updatePrivacy', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, privacy: newPrivacySetting }),
      });

      if (!response.ok) {
        Alert.alert('Error', 'Failed to update privacy setting.');
        setIsPrivate(!newPrivacySetting);
      }
    } catch (error) {
      Alert.alert('Error', 'Could not update privacy setting.');
      setIsPrivate(!newPrivacySetting);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image source={profileInfo.pfp} style={styles.profilePhoto} />
        <Text style={styles.username}>{profileInfo.username}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.sectionContent}>{profileInfo.desc}</Text>
        <Pressable style={styles.button} onPress={() => setIsModalVisible(true)}>
          <Text style={styles.buttonText}>Edit Description</Text>
        </Pressable>
        <ModalPopup
          editable={profileInfo.desc}
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onSave={handleSaveDescription}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy Settings</Text>
        <View style={styles.privacyToggle}>
          <Text style={styles.sectionContent}>{isPrivate ? 'Private Mode' : 'Public Mode'}</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isPrivate ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={togglePrivacy}
            value={isPrivate}
          />
        </View>
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

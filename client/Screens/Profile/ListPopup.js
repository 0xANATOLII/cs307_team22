import React from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, StyleSheet, Dimensions, Image } from 'react-native';

const { height, width } = Dimensions.get('window');

export default function ListPopup({ title, visible, data, onClose, navigation, route }) {
  const defaultImageUri = Image.resolveAssetSource(require('./default.png')).uri;
  const handleUserPress = (user) => {
    console.log(user);
    navigation.navigate("ViewProfile", { user });
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{title}</Text>
          <FlatList
            data={data}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.listItemContainer}
                onPress={() => handleUserPress(item.user)}
              >
                <Image 
                  source={{ uri: item.user.pfp || defaultImageUri }} // Fallback to placeholder if no profile picture
                  style={styles.profilePicture} 
                />
                <Text style={styles.listItemText}>{item.user.username || "no user name found"}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
          <TouchableOpacity style={[styles.button, styles.closeButton]} onPress={onClose}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
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
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: height / 2,
    width: width,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  listItemText: {
    fontSize: 16,
  },
  button: {
    borderRadius: 5,
    padding: 10,
    marginTop: 15,
    backgroundColor: '#FF6347',
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

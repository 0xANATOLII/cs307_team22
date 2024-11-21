import { StyleSheet } from 'react-native';
import { Platform } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
  text: {
    fontSize: 14,
    color: 'black',
    marginBottom: 30,
    textAlign: 'center',
  },
  sectionText: {
    fontSize: 18,
    color: 'black',
    marginBottom: 30,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',          
    fontSize: 16,          
    marginVertical: 10,    
    textAlign: 'center',
  },
  input: {
    width: '80%',
    height: 50,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    fontSize: 16,
  },
  button: {
    width: '80%',
    height: 50,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 10,
    zIndex: 1,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPasswordText: {
    fontSize: 16,
    color: 'black',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
  profilePhoto: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  mapProfilePhoto: {
    width: 40,
    height: 40,
    borderRadius: 40,
  },
  section: {
    backgroundColor: '#ffffff',
    marginTop: 20,
    padding: 15,
    alignItems: 'center',
    width: '100%',
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
  privacyToggle: {
    width: 200,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  SignoutButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  SignoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  SignoutCenteredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  SignoutModalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  SignoutModalTitle: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  SignoutModalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 16,
  },
  SignoutModalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
  },
  SignoutButtonOutline: {
    backgroundColor: 'white',
    borderColor: '#2196F3',
    borderWidth: 1,
  },
  SignoutButtonOutlineText: {
    color: '#2196F3',
  },
  SignoutButtonFilled: {
    backgroundColor: '#2196F3',
  },
  SignoutButtonFilledText: {
    color: 'white',
  },
  scrollViewContent: {
    paddingTop: 60,
    flexGrow: 1,
    paddingBottom: 40,
  },
  profileContainer: {
    alignItems: 'center',
  },

  // Style for the modal's semi-transparent background
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
  },
  
  // Style for the modal container
  modalContainer: {
    width: '80%',
    backgroundColor: 'white', // Modal content background
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000', // Add shadow for a more prominent appearance
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Android shadow effect
  },
  
  // Style for the modal title
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },

  // Style for the image preview
  modalImagePreview: {
    width: 150,
    height: 150,
    borderRadius: 75, // Circular image preview
    marginBottom: 20,
  },
  
  // Cancel button specific style
  modalCancelButton: {
    backgroundColor: '#d9534f', // Red for cancel button
  },
  
  // Confirm button specific style
  modalConfirmButton: {
    backgroundColor: '#5cb85c', // Green for confirm button
  },
  
  // Text style for the buttons
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  safeArea: {
    flex: 1,
    justifyContent: 'center',
  },
  
  map: {
    width: '100%',
    height: '100%',
  },
  
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  searchResultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchBar: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
  },
  searchButton: {
    marginLeft: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: 'black',
    borderRadius: 5,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  likeButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    marginRight: 10,
  },
  likeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  likeCount: {
    color: '#888',
    marginRight: 10,
  },
  monumentHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    backgroundColor: '#f5f5f5',
    flexDirection: 'row',
    alignItems: 'center',
  },
  monumentCard: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  monumentCardInactive: {
    opacity: 0.6,
  },
  monumentIcon: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  monumentInfo: {
    flex: 1,
  },
  monumentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  monumentDistance: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  inRangeText: {
    color: 'green',
    fontWeight: 'bold',
  },
  refreshButton: {
    padding: 16,
    alignItems: 'center',
  },
  rbutton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  refreshbuttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  userItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  usernameText: {
    fontSize: 16,
    flex: 1,  // Allow the username text to take up available space
  },
  followButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  followButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  unfollowButton: {
    backgroundColor: '#FF3B30', // Red for "Unfollow" button
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  followContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 15,
  },
  followCount: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  followCountNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  followCountLabel: {
    fontSize: 14,
    color: '#888',
  },
  wishlistButton: {
    backgroundColor: '#007AFF', // Similar to the follow button
    paddingVertical: 6, // Same padding as followButton
    paddingHorizontal: 15, // Same horizontal padding as followButton
    borderRadius: 5, // Rounded edges
    alignItems: 'center', // Center text horizontally
    justifyContent: 'center', // Center text vertically
    marginLeft: 10, // Slight margin for separation
    marginRight: 16, // Align neatly to the right within the card
  },
  wishlistButtonText: {
    color: '#FFFFFF', // White text for contrast
    fontWeight: 'bold', // Bold text for emphasis
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  icon: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  
  
});


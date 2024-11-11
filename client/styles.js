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
    color: 'black',
    marginBottom: 5,
    zIndex: -1,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 10,
    marginBottom: 5,
    zIndex: -1,
    textAlign: 'center',
  },
  text: {
    fontSize: 14,
    color: 'black',
    marginBottom: 30,
    zIndex: -1,
    textAlign: 'center',
  },
  sectionText: {
    fontSize: 18,
    color: 'black',
    marginBottom: 30,
    zIndex: -1,
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
  
  // Style for the buttons container
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  
  // General button style
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 5,
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
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,  //PLATFORM DEPENDENT
    zIndex: 1000,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#666',
  },
  navTextActive: {
    color: '#007AFF',
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

  BScontainer: {
    flex: 1,
    padding: 20,
  },
  BSbadgeContainer: {
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  BSbadgeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  BSbadgeSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  BScommentToggleButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  BScommentToggleText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  BScreateBadgeContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 3,
  },
  BSinput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  BScreateButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
  },
  BScreateButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  BSnoBadgesText: {
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
    fontSize: 18,
    color: '#777',
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
  BScommentToggleButton: {
    backgroundColor: '#007bff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  BScommentToggleText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
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
  BSsectionHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
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











  //Revamped UI (use these as much as possible)
  QQcontainer: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#121212',
  },
  QQsafeArea: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  QQpermissionContainer: {
    padding: 20,
    alignItems: 'center',
  },
  QQpermissionText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  QQpermissionButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  QQpermissionButtonText: {
    color: '#121212',
    fontSize: 16,
    fontWeight: '600',
  },
  QQscrollContent: {
    flexGrow: 1,
  },
  QQcarouselContainer: {
    height: Dimensions.get('window').height * 0.9,
    position: 'relative',
    marginBottom: 20,
  },
  QQslideContainer: {
    width: Dimensions.get('window').width,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  QQimageContainer: {
    width: '100%',
    height: '100%',
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.5)',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  QQactiveImage: {
    borderColor: '#FFD700',
    borderWidth: 3,
  },
  QQimage: {
    width: '95%',
    height: '100%',
    borderRadius: 12,
  },
  QQindicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 30,
    width: '100%',
  },
  QQindicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 4,
  },
  QQactiveIndicator: {
    backgroundColor: '#FFD700',
  },
  contentContainer: {
    padding: 20,
  },
  QQlabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFD700',
    marginBottom: 10,
  },
  QQdescriptionInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
    color: 'white',
    marginBottom: 20,
    height: 100,
    textAlignVertical: 'top',
  },
  QQmapContainer: {
    height: 200,
    overflow: 'hidden',
    marginBottom: 20,
  },
  QQbuttonContainer: {
    gap: 15,
  },
  QQbutton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  QQpostButton: {
    marginBottom: 10,
  },
  QQgradientButton: {
    padding: 15,
    alignItems: 'center',
  },
  QQpostButtonText: {
    color: '#121212',
    fontSize: 18,
    fontWeight: '600',
  },
  QQsecondaryButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  QQsecondaryButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    alignItems: 'center',
    borderRadius: 25,
  },
  QQsecondaryButtonText: {
    color: 'white',
    fontSize: 16,
  },
  QQcamera: {
    flex: 1,
    backgroundColor: '#121212',
  },
  QQcameraOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'space-between',
    padding: 20,
  },
  QQcameraText: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 40,
  },
  QQcameraControls: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  QQflipButton: {
    padding: 10,
  },
  QQcaptureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  QQcaptureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFD700',
  },
  
});


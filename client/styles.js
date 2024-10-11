import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
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
    flexGrow: 1,
    paddingBottom: 20,
  },
  profileContainer: {
    alignItems: 'center',
  },
});
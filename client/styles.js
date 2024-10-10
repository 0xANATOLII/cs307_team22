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
    marginTop: 20,
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
    flexDirection: 'row',
    alignItems: 'center',
  },
});
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Config from "../config";
import { ActivityIndicator, View,Text ,StyleSheet,Image, Dimensions,ScrollView,Touchable,TouchableOpacity,Share} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from '../styles';
import { Icon } from 'react-native-elements';
import TestPage from "./Components/TestPage.js";
import { useRoute } from "@react-navigation/native";
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Network from 'expo-network';
import { LocationContext } from "./Components/locationContext";
import * as  Linking  from 'expo-linking';

export default function BadgePage({route,navigation}){
    

    //const {username} = route.params;
    const [curLink,setCurLink] = useState("")
    const route_ = useRoute();
    const { acusername, acbadgeId } = route_.params;
    const [badge,setBadge] = useState(null)
    const [loading,setLoading] = useState(null)
    const [error,setError] = useState(null)
    const [userData,setUserData] = useState(null)
   
    const screenHeight = Dimensions.get('window').height
    const defaultImageUri = Image.resolveAssetSource(require('./Profile/default.png')).uri;
    const [monumneName,setMonumentName] = useState(null)
    const [activePhoto, setActivePhoto] = useState(0);
    const [isCommentsVisible, setCommentsVisible] = useState(false);
    const [isNotFound,setIsNotFound] = useState(false)

    const fetchBadge = async ()=>{
        try{
        
            const response = await axios.get(`${Config.API_URL}/user/badge/${acusername}/${acbadgeId}`)///user/badge/tolik/672477d217b9a8b6d39596ca`)
            console.log(response.data)
            if(response){
                console.log("RESPONS")
                console.log(response.data.userId)

                const userresp = await axios.get(`${Config.API_URL}/user/${response.data.userId}`)
                console.log(userresp.data)
                if(userresp.pfp==null)
                    console.log("No pic")

                //http://localhost:6000/monument/6724670419ef3c7b77d3ab34
                let monumentN = ""
                if(response.data.monumentId){
                    const monresp = await axios.get(`${Config.API_URL}/monument/${response.data.monumentId}`)
                    if(monresp.data.name){
                        monumentN = monresp.data.name
                    }
                }
                if(monumentN=="")
                    monumentN = "None"

                setMonumentName(monumentN)
                setUserData(userresp.data)
                setBadge(response.data)
                
            }


        }catch(error){
            console.log("ERROR : "+error)
            setIsNotFound(true)
            setError(error)
        }
        finally{
            setLoading(false)
        }
      
    }
    async function getMetroUrl() {
       
        setCurLink(Linking.getLinkingURL()) 
       
      }
      
    useEffect(()=>{
        
        getMetroUrl();
    },[])
      
    useEffect(()=>{

        console.log(route_.params)

        fetchBadge()

    },[])
    if(isNotFound)
        return(
            <View style={{height:screenHeight,backgroundColor:'black',justifyContent:"center",alignContent:'center',alignItems:'center'}}>
                <Text style={{color:'red'}}>
                    This page is not found !
                </Text>
            </View>
        )
    
   /* useEffect(async()=>{
        //await getMetroUrl();
        //console.log("LINK : ===="+link__)
        
    },[])

    useEffect( async ()=>{
   

       // console.log("route info")
       // console.log(route_.params)
        //console.log("-----------------")
        
        //console.log(route.params)
        //console.log(accusername)
        //console.log(acbadgeId)
        
        //fetchBadge();
        //console.log(JSON.stringify(badge, null, 2))
        
    },[])
*/
    const onShare = async () => {
        try {
            console.log("SHARE : "+curLink)
            if(curLink==""&&acusername&&acbadgeId)
                return

        const shareLink = curLink.toString()+'badge/'+acusername+'/'+acbadgeId;
          const result = await Share.share({
            message: '',
            url:shareLink
            // If you're sharing an URL:
            // url: 'https://your-post-url.com', // Or add a dynamic URL
          });
      
          if (result.action === Share.sharedAction) {
            if (result.activityType) {
              // Share completed with activity type
              console.log('Shared with activity type: ', result.activityType);
            } else {
              // Share completed
              console.log('Post shared!');
            }
          } else if (result.action === Share.dismissedAction) {
            // Share dismissed
            console.log('Share dismissed');
          }
        } catch (error) {
          console.error('Error sharing:', error.message);
        }
      };
      

    if (loading) {
        return (
          <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Loading a badge ...</Text>
          </SafeAreaView>
        );
      }

    if(false)
    return(
        <View style={[{height: screenHeight  ,backgroundColor:'gray',paddingTop:60}]}>
           
           
           {/* Top Block */}
            <View style={[stylesLables.center,{borderTopWidth:3,borderTopColor:'white'}, stylesBadge.shadDown]}>
            {userData&&(
                <Text style={stylesLables.textLable}>{userData.username.toUpperCase()}</Text>
            )}
            


            </View>

           
            {badge && (
                <View>
                    
                                    <Image
                    source={{ uri: `${Config.API_URL}/badge/pic/${badge.picture}` }}
                    style={[stylesimg.image, { height: screenHeight * 0.7 }]}
                    resizeMode="cover" // Adjust to "contain" or other modes if needed
                    />
                <View>
                        <Text>Location: {badge.location}</Text>
                        <Text>User ID: {badge.userId}</Text>
                        <Text>Monument ID: {badge.monumentId}</Text>
                    
                    </View>
                </View>


            )}

  


      


        </View>
    )


    
    return (
        <ScrollView style={[styless.container,{ paddingBottom: 300}]}>
          {/* Top Bar */}
          <View style={[styless.topBar]}>
            <TouchableOpacity onPress={()=>{navigation.goBack()}} style={{marginRight:10}}>
              <Icon name="arrow-back" type="ionicon" color="#fff" size={25} />
            </TouchableOpacity>
            {userData&&monumneName&&(
                <View style={{flex:1,flexDirection:'row',justifyContent:'start',alignItems:'center'}}>
                        <TouchableOpacity onPress={()=>{alert("This is an account of : "+userData.username)}}>
                        <Image
                            source={{
                                uri: userData.pfp 
                                    ? `${Config.API_URL}/badge/pic/${badge.picture}` 
                                    : defaultImageUri
                            }}
                            style={{
                                width: 30,
                                height: 30,
                                borderRadius: 15, // half of the width/height for a circular shape
                            }}
                        />
                        </TouchableOpacity>
                    <View>
                        <Text style={[styless.username,stylesLables.textLableCF]}>{userData.username.toUpperCase()}</Text>
                        <TouchableOpacity onPress={()=>{alert("Statue : "+monumneName)}}>
                            <Text style={[styless.username,stylesLables.textLinkSml]}>{monumneName.toUpperCase()}</Text>
                        </TouchableOpacity>
                       
                    </View>
                </View>
        )}
            </View>
    
          {/* Image Post */}
          {badge&&(
        <View style={stylesBC.carouselContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          bounces={false}
        >
             <View style={stylesBC.slideContainer}>
                   
                    <Image
                        source={{ uri: `${Config.API_URL}/badge/pic/${badge.picture}` }} // Replace with your image URI
                        style={[styless.postImage,{ height: screenHeight * 0.7 },stylesBC.image]}
                        resizeMode="cover"
                    />
                </View>
                <View style={stylesBC.slideContainer}>
                <Image
                        source={{ uri: `${Config.API_URL}/badge/pic/${badge.picturef}` }} // Replace with your image URI
                        style={[styless.postImage,{ height: screenHeight * 0.7 },stylesBC.image]}
                        resizeMode="cover"
                    />
                </View>
        </ScrollView>

        <View style={stylesBC.indicatorContainer}>
          <View style={[stylesBC.indicator, activePhoto === 0 && stylesBC.activeIndicator]} />
          <View style={[stylesBC.indicator, activePhoto === 1 && stylesBC.activeIndicator]} />
        </View>
        
      </View>
         
        )}
          {/* Action Bar */}
          <View style={styless.actionBar}>
            <Icon name="heart-outline" type="ionicon" color="#fff" size={25} />
            <TouchableOpacity onPress={() => setCommentsVisible(true)} >
            <Icon name="chatbubble-outline" type="ionicon" color="#fff" size={25} />
            </TouchableOpacity>
           
           <TouchableOpacity onPress={onShare}>
                <Icon name="send-outline" type="ionicon" color="#fff" size={25}  />
            </TouchableOpacity>

          </View>
          {isCommentsVisible==true&&(
            <View style={{ flex: 1 }}>
                        <TestPage visible={isCommentsVisible} setVisible={setCommentsVisible} onClose={() => setCommentsVisible(false)} />
                        </View>

          )}
         
    
          {/* Post Info */}
          {badge&&(
          <View style={styless.postInfo}>
            <Text style={styless.likesText}>Likes :0</Text>
            <Text style={styless.caption}>{badge.name}</Text>
            <Text style={styless.dateText}>{badge.location}</Text>
          </View>
         )}
          <View style={{ height: 100 }} />
        </ScrollView>
      );
    }
    
    const styless = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#000',
        paddingTop:40,
        height:10000
      },
      topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingTop: 15,

      },
      username: {
        color: '#fff',
        fontSize: 18,
        marginLeft: 10,
        fontWeight: 'bold',
      },
      postImage: {
        width: '100%',
        resizeMode: 'cover',
        marginVertical: 10,
      },
      actionBar: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 10,
        justifyContent: 'space-between',
      },
      postInfo: {
        paddingHorizontal: 15,
      },
      likesText: {
        color: '#fff',
        fontWeight: 'bold',
      },
      caption: {
        color: '#fff',
        marginTop: 5,
      },
      dateText: {
        color: '#888',
        marginTop: 5,
        fontSize: 12,
      },
    });
const stylesLables = StyleSheet.create({
    textLinkSml:{
        color:'white',
        fontSize: 14,
        textDecorationLine:'underline',
        fontWeight:'400'
    },  
    textLableCF:{
        fontSize: 18,
        color: '#FFD700',
        fontWeight: '600',
    },
    textLable:{
        fontSize: 18,
        fontWeight: '600',
        color: '#FFD700',
        margin:10  
    },
    center:{
        alignItems: 'center',
        justifyContent: 'center',
    }


})
const stylesBadge = StyleSheet.create({
    container: {
        paddingTop: 50,
        paddingHorizontal: 20,
        backgroundColor: 'white', // Ensures the shadow is visible
        alignItems: 'center',
        justifyContent: 'center',

        },
    shadDown:{
        // Shadow properties for iOS
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 }, // Adjust height for more pronounced shadow
        shadowOpacity: 0.3, // Increase for visibility
        shadowRadius: 4.65,

        // Shadow property for Android
        elevation: 6,
 
    }
});


const stylesimg = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'black',
    },
    image: {
    width: '100%',
      
      borderRadius: 10, // Optional: makes the image have rounded corners
    },
  });


const stylesBC = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 50,
      backgroundColor: '#121212',
    },
    safeArea: {
      flex: 1,
      backgroundColor: '#121212',
      justifyContent: 'center',
      alignItems: 'center',
    },
    permissionContainer: {
      padding: 20,
      alignItems: 'center',
    },
    permissionText: {
      color: 'white',
      fontSize: 16,
      marginBottom: 20,
      textAlign: 'center',
    },
    permissionButton: {
      backgroundColor: '#FFD700',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 25,
    },
    permissionButtonText: {
      color: '#121212',
      fontSize: 16,
      fontWeight: '600',
    },
    scrollContent: {
      flexGrow: 1,
    },
    carouselContainer: {
      height: Dimensions.get('window').height * 0.9,
      position: 'relative',
      marginBottom: 20,
    },
    slideContainer: {
      width: Dimensions.get('window').width,
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    imageContainer: {
      width: '100%',
      height: '100%',
      borderWidth: 2,
      borderColor: 'rgba(255, 215, 0, 0.5)',
      borderRadius: 12,
      overflow: 'hidden',
      marginBottom: 20,
    },
    activeImage: {
      borderColor: '#FFD700',
      borderWidth: 3,
    },
    image: {
      width: '95%',
      height: '100%',
      borderRadius: 12,
    },
    indicatorContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      position: 'absolute',
      bottom: 30,
      width: '100%',
    },
    indicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
      marginHorizontal: 4,
    },
    activeIndicator: {
      backgroundColor: '#FFD700',
    },
    contentContainer: {
      padding: 20,
    },
    label: {
      fontSize: 18,
      fontWeight: '600',
      color: '#FFD700',
      marginBottom: 10,
    },
    descriptionInput: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 12,
      padding: 15,
      color: 'white',
      marginBottom: 20,
      height: 100,
      textAlignVertical: 'top',
    },
    mapContainer: {
      height: 200,
      overflow: 'hidden',
      marginBottom: 20,
    },
    buttonContainer: {
      gap: 15,
    },
    button: {
      borderRadius: 25,
      overflow: 'hidden',
    },
    postButton: {
      marginBottom: 10,
    },
    gradientButton: {
      padding: 15,
      alignItems: 'center',
    },
    postButtonText: {
      color: '#121212',
      fontSize: 18,
      fontWeight: '600',
    },
    secondaryButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 10,
    },
    secondaryButton: {
      flex: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      padding: 15,
      alignItems: 'center',
      borderRadius: 25,
    },
    secondaryButtonText: {
      color: 'white',
      fontSize: 16,
    },
    camera: {
      flex: 1,
      backgroundColor: '#121212',
    },
    cameraOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      justifyContent: 'space-between',
      padding: 20,
    },
    cameraText: {
      color: '#FFD700',
      fontSize: 24,
      fontWeight: '600',
      textAlign: 'center',
      marginTop: 40,
    },
    cameraControls: {
      position: 'absolute',
      bottom: 30,
      alignSelf: 'center',
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 30,
    },
    flipButton: {
      padding: 10,
    },
    captureButton: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    captureButtonInner: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: '#FFD700',
    },
  });
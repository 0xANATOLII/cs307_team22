import axios from 'axios';
import Config from "../config.js";

export const postAbadge = async (username,name, picture,picturef,location,monument_n) => {
    let resp = "200";
    try{
        //byname/${monument_n}
        //console.log("MONUMENT:"+monument_n)


        const monId = await  axios.get(`${Config.API_URL}/monument/byname/${encodeURIComponent(monument_n)}`)
            .then(response => {
                //console.log("MONUMENT RESP : "+monId)
                if(response.data){
                    if(response.data._id){
                        return response.data._id
                    }
                }
                resp= "400 Opps we have an issue !"

            })
            .catch(error => {
                resp='400 There was an error making the request monumnet:'+error
                console.error(resp);
                return resp;
            });

        const respt = await axios.get(`${Config.API_URL}/user/id/tolik`)
        //console.log(respt.data.userId)
        const uid = await  axios.get(`${Config.API_URL}/user/id/${encodeURIComponent(username)}`)
            .then(response => {
                if(response.data){
                    //console.log("Response : "+response.data)
                    if(response.data.userId){
                        return response.data.userId
                    }
                }
                resp = "400 Opps we have an issue !"
            })
            .catch(error => {
                resp='400 There was an error making the request uid:'+error
                console.error(resp);
                return resp;
            });

        //console.log("LOCATIoN")
        //console.log(location)

        const loca = `latitude: ${location.coords.latitude}, longitude: ${location.coords.longitude}`;

        if(!loca){
            resp = "Opps, problem with location !"
        }


        //console.log("DATA :================")
        //console.log("Mon id : "+monId)
        //console.log("username : "+username)
        const formData = new FormData();

// Append files to formData
        formData.append('picture', {
            uri: picture.uri,  // Replace with the local path to the image
            type: 'image/jpeg', // Replace with the appropriate MIME type
            name: 'back.jpg', // Original name or any name you prefer
        });

        formData.append('picturef', {
            uri: picturef.uri,  // Replace with the local path to the image
            type: 'image/jpeg', // Replace with the appropriate MIME type
            name: 'front.jpg', // Original name or any name you prefer
        });

// Add additional fields to formData (your `createBadgeDto` object)
        formData.append('name', name);
        formData.append('location', loca);
        formData.append('userId', uid);
        formData.append('monumentId',  monId);
        formData.append('username',  username);

        try {
            const response = await axios.post(`${Config.API_URL}/badge/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return  "200";
        } catch (error) {

            resp='400 Error uploading files::'+error
            console.error(resp);
            return resp;
        }

    }finally{
        return resp;
    }
    /* const response = await axios.delete(`${process.env.URL}/user/${userId}`); // Adjust the URL as needed
     return response.data;*/
};


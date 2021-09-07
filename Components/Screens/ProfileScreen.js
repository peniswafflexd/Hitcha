import React, {useState} from 'react';
import {Image, SafeAreaView, ScrollView, Text, View} from 'react-native';
import Header from "../Header";
import {ProfileSnapshot, signOutFirebase} from "../API/RouteAPI";
import CustomButton from "../CustomButton";
import {createStackNavigator} from "@react-navigation/stack";
import UpdateProfile from "./UpdateProfile";

export const testCoverPhoto = "http://wallpapers.net/web/wallpapers/man-carrying-a-backpack-hd-wallpaper/thumbnail/lg.jpg"
export const testProfilePhoto = "https://prd-wret.s3.us-west-2.amazonaws.com/assets/palladium/production/s3fs-public/styles/full_width/public/thumbnails/image/placeholder-profile_1.png"

const Stack = createStackNavigator();

function ProfileScreen({navigation}) {
    return <Stack.Navigator initalRouteName={"Profile"} headerMode={false}>
        <Stack.Screen name={"Profile"} component={Screen}/>
        <Stack.Screen name={"Update Profile"} component={UpdateProfile}/>
    </Stack.Navigator>
}

const Screen = ({navigation}) => {
    const [profileData, setProfileData] = useState(null);
    ProfileSnapshot(setProfileData);
    if (profileData === null) return null;
    return (
        <SafeAreaView style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#191919'}}>
            <Header title={"Profile"}/>
            <View style={{flex: 1, backgroundColor: '#191919', flexDirection: 'column', width: '100%'}}>
                <ProfileImages profileData={profileData}/>
                <ProfileContent navigation={navigation} profileData={profileData}/>
            </View>
        </SafeAreaView>
    );
}

const ProfileImages = ({profileData}) => {
    const [profileImage, setProfileImage] = useState(testProfilePhoto);
    const [coverImage, setCoverImage] = useState(testCoverPhoto);
    if (profileData.profile.hasProfile && profileImage !== profileData.profile.profileURL) setProfileImage(profileData.profile.profileURL)
    if (profileData.profile.hasCover && coverImage !== profileData.profile.coverURL) setCoverImage(profileData.profile.coverURL)
    return (
        <View style={{flex: 0.3, width: '100%', alignItems: 'center', zIndex: 10}}>
            <Image source={{uri: coverImage}} style={{width: '100%', height: '100%'}}/>
            <Image source={{uri: profileImage}}
                   style={{
                       width: 100,
                       height: 100,
                       borderRadius: 50,
                       marginTop: -50,
                       borderWidth: 2,
                       borderColor: '#252525',
                   }}/>
        </View>
    )
}

const ProfileContent = ({navigation, profileData}) => {
    return (
        <ScrollView style={{flex: 0.65, margin: 20}}>
            <Text style={{
                fontWeight: "bold",
                fontSize: 24,
                color: "#C1C1C1",
                marginTop: 50
            }}>{profileData.profile.firstname + " " + profileData.profile.lastname}</Text>
            <View
                style={{borderRadius: 10, backgroundColor: '#4D4B4B', alignSelf: 'baseline', margin: 10, padding: 15}}>
                <Text style={{color: "#C1C1C1"}}>{profileData.profile.bio}</Text>
            </View>
            <View>
                <CustomButton text={"Update Profile"} onPress={() => navigation.navigate("Update Profile", {bio: profileData.profile.bio})}
                              textStyle={{color: '#FDAF01'}}
                              buttonStyle={{borderWidth: "2", borderColor: '#FDAF01', height: 50, marginBottom: 10}}/>
                <CustomButton text={"Sign Out"} onPress={signOutFirebase} textStyle={{color: 'red'}}
                              buttonStyle={{borderWidth: "2", borderColor: 'red', height: 50}}/>
            </View>
        </ScrollView>
    )
}

export default ProfileScreen;
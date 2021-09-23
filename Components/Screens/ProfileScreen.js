import React, {useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import Header from "../Header";
import CustomButton from "../CustomButton";
import {createStackNavigator} from "@react-navigation/stack";
import UpdateProfile from "./UpdateProfile";
import {colors} from "../../Styles/GlobalStyles"
import CustomFastImage from "../CustomFastImage";
import ModalLoader from "../ModalLoader";
import {signOutFirebase} from "../API/AuthenticationAPI";
import {ProfileSnapshot} from "../API/ProfileAPI";

const Stack = createStackNavigator();

/**
 * Navigation that either displays the profile screen
 * or the update profile screen
 * @param navigation
 * @returns {JSX.Element}
 * @constructor
 */
function ProfileScreen({navigation}) {
    return <Stack.Navigator initalRouteName={"Profile"} headerMode={false}>
        <Stack.Screen name={"Profile"} component={Screen}/>
        <Stack.Screen name={"Update Profile"} component={UpdateProfile}/>
    </Stack.Navigator>
}

/**
 * The full layout of the user profile.
 * @param navigation
 * @returns {JSX.Element}
 * @constructor
 */
const Screen = ({navigation}) => {
    const [profileData, setProfileData] = useState(null);
    ProfileSnapshot(setProfileData);
    return (
        <SafeAreaView style={styles.safeArea}>
            <Header title={"Profile"}/>
            <View style={styles.photoLayout}>
                <ProfileImages profileData={profileData}/>
                <ProfileContent navigation={navigation} profileData={profileData}/>
            </View>
        </SafeAreaView>
    );
}

/**
 * Returns the styles images for the users profile.
 * @param profileData - user profile data
 * @returns {JSX.Element}
 * @constructor
 */
const ProfileImages = ({profileData}) => {
    if (!profileData?.profile) return <ModalLoader isLoading={true}/>
    let coverImage = profileData.profile.coverURL
    let profileImage = profileData.profile.profileURL
    return (
        <View style={{flex: 0.3, width: '100%', alignItems: 'center', zIndex: 10}}>
            <CustomFastImage
                source={{uri: coverImage}}
                style={{width: '100%', height: '100%'}}
            />
            <CustomFastImage
                source={{uri: profileImage}}
                style={styles.profilePhoto}
            />
        </View>
    )
}

/**
 * Returns the content of the profile, user name, bio and profile buttons.
 * @param navigation
 * @param profileData - user profile data
 * @returns {JSX.Element}
 * @constructor
 */
const ProfileContent = ({navigation, profileData}) => {
    return (
        <ScrollView style={{flex: 0.65, margin: 20}}>
            <Text
                style={styles.username}>{profileData?.profile?.firstname + " " + profileData?.profile?.lastname}</Text>
            <View style={styles.bio}>
                <Text style={{color: colors.lightText}}>{profileData?.profile?.bio}</Text>
            </View>
            <View>
                <CustomButton text={"Update Profile"}
                              onPress={() => navigation.navigate("Update Profile", {bio: profileData?.profile?.bio})}
                              textStyle={{color: colors.primary}}
                              buttonStyle={{
                                  borderWidth: "2",
                                  borderColor: colors.primary,
                                  height: 50,
                                  marginBottom: 10
                              }}/>
                <CustomButton text={"Sign Out"}
                              onPress={signOutFirebase}
                              textStyle={{color: 'red'}}
                              buttonStyle={{borderWidth: "2", borderColor: 'red', height: 50}}/>
            </View>
        </ScrollView>
    )
}

export default ProfileScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.darkBlack
    },
    profilePhoto: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginTop: -50,
        borderWidth: 2,
        borderColor: colors.mediumBlack,
    },
    username: {
        fontWeight: "bold",
        fontSize: 24,
        color: "#C1C1C1",
        marginTop: 50
    },
    bio: {
        borderRadius: 10,
        backgroundColor: '#4D4B4B',
        alignSelf: 'baseline',
        margin: 10,
        padding: 15
    },
    photoLayout: {
        flex: 1,
        backgroundColor: colors.darkBlack,
        flexDirection: 'column',
        width: '100%'
    }


})
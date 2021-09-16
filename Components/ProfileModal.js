import React, {useState} from 'react'
import {Image, Pressable, ScrollView, Text, View, StyleSheet} from "react-native";
import Modal from "react-native-modal";
import {ProfileSnapshot} from "./API/RouteAPI";
import {placeHolderProfilePhoto} from "./Screens/ProfileScreen";
import CustomButton from "./CustomButton";
import {colors} from "../Styles/GlobalStyles"

/**
 * A modal that shows a basic outline of a users profile
 * @param modalVisible - whether component is visible
 * @param setModalVisible - function to set whether component is visible
 * @param memberID - memberID of the profile to be displayed
 * @param setMessageScreen - function to change to the messages of the person being displayed
 * @returns {JSX.Element}
 * @constructor
 */
const ProfileModal = ({modalVisible, setModalVisible, memberID, setMessageScreen}) => {
    const [userProfileData, setUserProfileData] = useState({});
    const [animationTiming, setAnimationTiming] = useState(100)
    ProfileSnapshot(setUserProfileData, memberID)

    return (
        <Modal isVisible={modalVisible}
               onBackdropPress={() => setModalVisible(!modalVisible)}
               style={{justifyContent: 'center', alignItems: 'center'}}
               animationIn={'zoomIn'} animationOut={'zoomOut'}
               animationOutTiming={animationTiming}>
            <View style={styles.modal}>

                <Pressable style={{flex: 0.1, alignSelf: 'flex-end'}} onPress={() => setModalVisible(!modalVisible)}>
                    <Image source={require('../assets/icons/close.png')}
                           resizeMode={"contain"}
                           style={styles.closeIcon}
                    />
                </Pressable>

                <ProfilePhoto profileData={userProfileData}/>
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContainer}>
                    <Text style={styles.firstname}>{userProfileData?.profile?.firstname}</Text>
                    <Text style={styles.bioTitle}>Bio:</Text>
                    <Text style={styles.bio}>{userProfileData?.profile?.bio}</Text>
                </ScrollView>

            </View>
        </Modal>
    )
}

/**
 * profile image for the profile modal.
 * @param profileData - users profileData containing hasProfile and profileURL fields
 * @returns {JSX.Element}
 * @constructor
 */
const ProfilePhoto = ({profileData}) => {
    const [profileImage, setProfileImage] = useState(placeHolderProfilePhoto);
    if (profileData?.profile?.hasProfile && profileImage !== profileData?.profile?.profileURL) setProfileImage(profileData?.profile?.profileURL)
    return (
        <View style={{flex: 0.3, width: '100%', alignItems: 'center', zIndex: 10}}>
            <Image source={{uri: profileImage}} style={styles.profileImage}/>
        </View>
    )
}

export default ProfileModal

const styles = StyleSheet.create({
    modal: {
        height: '50%',
        width: '95%',
        backgroundColor: colors.mediumBlack,
        borderRadius: 10,
        flexDirection: 'column',
    },
    closeIcon: {
        position: 'absolute',
        width: 20,
        height: 20,
        top: 10,
        right: 10,
        tintColor: colors.primary,
        zIndex: 100,
    },
    scrollView: {
        flex: 1,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
    },
    scrollViewContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10
    },
    firstname: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        textDecorationLine: 'underline'
    },
    bioTitle: {
        color: 'gray',
        marginTop: 10,
        fontSize: 14,
        alignSelf: 'flex-start',
        fontWeight: 'bold'
    },
    bio: {
        color: 'gray',
        fontSize: 14,
        marginLeft: 10
    },
    profileImage: {
        width: 130,
        height: 130,
        borderRadius: 65,
        marginTop: -80,
        borderWidth: 2,
        borderColor: colors.mediumBlack,
    },

})
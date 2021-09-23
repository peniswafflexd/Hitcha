import React, {useState} from 'react'
import {Image, Pressable, ScrollView, StyleSheet, Text, View} from "react-native";
import Modal from "react-native-modal";
import {colors} from "../../Styles/GlobalStyles"
import CustomFastImage from "../Presentation/CustomFastImage";
import ModalLoader from "../Presentation/ModalLoader";
import {ProfileSnapshot} from "../API/ProfileAPI";

/**
 * A modal that shows a basic outline of a users profile
 * @param modalVisible - whether component is visible
 * @param setModalVisible - function to set whether component is visible
 * @param memberID - memberID of the profile to be displayed
 * @returns {JSX.Element}
 * @constructor
 */
const ProfileModal = ({modalVisible, setModalVisible, memberID}) => {
    const [userProfileData, setUserProfileData] = useState(null);
    let animationTiming = 100
    ProfileSnapshot(setUserProfileData, memberID)

    return (
        <Modal isVisible={modalVisible}
               onBackdropPress={() => setModalVisible(!modalVisible)}
               style={{justifyContent: 'center', alignItems: 'center'}}
               animationIn={'zoomIn'} animationOut={'zoomOut'}
               animationOutTiming={animationTiming}>
            <View style={styles.modal}>

                <Pressable style={{flex: 0.1, alignSelf: 'flex-end'}} onPress={() => setModalVisible(!modalVisible)}>
                    <Image source={require('../../assets/icons/close.png')}
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
    if (!profileData?.profile) return <ModalLoader isLoading={true}/>
    return (
        <View style={{flex: 0.3, width: '100%', alignItems: 'center', zIndex: 10}}>
            <CustomFastImage source={{uri: profileData?.profile?.profileURL}} style={styles.profileImage}/>
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
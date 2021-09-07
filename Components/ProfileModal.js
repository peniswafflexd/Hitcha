import React, {useState} from 'react'
import {Image, Pressable, ScrollView, Text, View} from "react-native";
import Modal from "react-native-modal";
import {ProfileSnapshot} from "./API/RouteAPI";
import {testProfilePhoto} from "./Screens/ProfileScreen";
import CustomButton from "./CustomButton";

const ProfileModal = ({modalVisible, setModalVisible, memberID, setMessageScreen}) => {
    const [userProfileData, setUserProfileData] = useState({});
    const [animationTiming, setAnimationTiming] = useState(100)
    ProfileSnapshot(setUserProfileData, memberID)

    return (
        <Modal isVisible={modalVisible} onBackdropPress={() => setModalVisible(!modalVisible)}
               style={{justifyContent: 'center', alignItems: 'center'}}
               animationIn={'zoomIn'} animationOut={'zoomOut'} animationOutTiming={animationTiming}>
            <View style={{
                height: '50%',
                width: '95%',
                backgroundColor: '#252525',
                borderRadius: 10,
                //top: '-12%',
                flexDirection: 'column',
            }}>
                <Pressable style={{flex: 0.1, alignSelf: 'flex-end'}} onPress={() => setModalVisible(!modalVisible)}>
                    <Image source={require('../assets/icons/close.png')}
                           resizeMode={"contain"}
                           style={{
                               position: 'absolute',
                               width: 20,
                               height: 20,
                               top: 10,
                               right: 10,
                               tintColor: '#FDAF01',
                               zIndex: 100,
                           }}/>
                </Pressable>
                <ProfilePhoto profileData={userProfileData}/>
                <ScrollView style={{
                    flex: 1,
                    borderTopRightRadius: 10,
                    borderTopLeftRadius: 10,
                }} contentContainerStyle={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    // marginTop: 10,
                    padding: 10
                }}>

                    <Text style={{
                        color: 'white',
                        fontSize: 24,
                        fontWeight: 'bold',
                        textDecorationLine: 'underline'
                    }}>{userProfileData?.profile?.firstname}</Text>
                    <Text style={{
                        color: 'gray',
                        marginTop: 10,
                        fontSize: 14,
                        alignSelf: 'flex-start',
                        fontWeight: 'bold'
                    }}>Bio:</Text>
                    <Text style={{
                        color: 'gray',
                        fontSize: 14,
                        marginLeft: 10
                    }}>{userProfileData?.profile?.bio}</Text>
                </ScrollView>

            </View>
        </Modal>
    )
}

const ProfilePhoto = ({profileData}) => {
    const [profileImage, setProfileImage] = useState(testProfilePhoto);
    console.log(profileData)
    if (profileData?.profile?.hasProfile && profileImage !== profileData?.profile?.profileURL) setProfileImage(profileData?.profile?.profileURL)
    return (
        <View style={{flex: 0.3, width: '100%', alignItems: 'center', zIndex: 10}}>
            <Image source={{uri: profileImage}}
                   style={{
                       width: 130,
                       height: 130,
                       borderRadius: 65,
                       marginTop: -80,
                       borderWidth: 2,
                       borderColor: '#252525',
                   }}/>
        </View>
    )
}

export default ProfileModal
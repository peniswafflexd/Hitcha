import React from 'react';
import {Image, Pressable, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {colors} from "../../Styles/GlobalStyles"
import CustomFastImage from "../Presentation/CustomFastImage";
import {Messages} from "../Business/Messages";


/**
 * Chat screen for messaging between members.
 * @param navigation
 * @param memberData - data for the member that is being messaged
 * @returns {JSX.Element}
 * @constructor
 */
function MessagesScreen({navigation, memberData}) {
    return (
        <SafeAreaView style={style.safeArea}>
            <View style={style.header}>
                <CustomFastImage source={{uri: memberData.photo}} style={style.profileImage}/>
                <Text style={style.username}>{memberData.name.split(' ')[0]}</Text>
                <View style={{flex: 0.1, right: 10, zIndex: 100}}>
                    <Pressable onPress={navigation}>
                        <Image
                            source={require('../../assets/icons/messages.png')}
                            resizeMode={"contain"}
                            style={style.messageIcon}
                        />
                    </Pressable>
                </View>
            </View>
            <Messages memberData={memberData}/>
        </SafeAreaView>
    )
}

export default MessagesScreen;

const style = StyleSheet.create({
    safeArea: {
        backgroundColor: colors.darkBlack,
        top: 0,
        height: '100%',
        width: '100%'
    },
    header: {
        flex: 0.10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: colors.mediumBlack,
        margin: 10,
        marginTop: 30
    },
    username: {
        flex: 1,
        left: 10,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 24,
    },
    messageIcon: {
        width: 32,
        height: 32,
        right: 10,
        tintColor: colors.primary,
        zIndex: 100
    },


})
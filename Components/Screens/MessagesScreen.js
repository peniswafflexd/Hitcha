import React, {useCallback, useLayoutEffect, useState} from 'react';
import {Image, Pressable, SafeAreaView, Text, View, StyleSheet} from 'react-native';
import {GiftedChat} from "react-native-gifted-chat";
import {auth, db, getConversationID, sendMessage} from "../API/RouteAPI";
import ProfileModal from "../ProfileModal";


function MessagesScreen({navigation, memberData, ...props}) {
    return (
        <SafeAreaView style={style.safeArea}>
            <View style={style.header}>
                <Image source={{uri: memberData.photo}} style={style.profileImage}/>
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
            <Messages memberData={memberData} {...props}/>
        </SafeAreaView>
    )
}

const Messages = ({memberData}) => {
    //if the conversationID isn't passed through then determine the conversationID from the member ID
    let finalConversationID = (memberData?.conversationID) ? memberData?.conversationID : getConversationID(memberData?.ID, memberData?.name, memberData?.photo)
    const [messages, setMessages] = useState([]);
    const [ProfileModalVisible, setProfileModalVisible] = useState(false);

    const onSend = useCallback((conversationID, memberID, messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
        sendMessage(messages, conversationID, memberID);
    }, [])

    //TODO: find a place to put this in the RouteAPI file.
    useLayoutEffect(() => {
        const unsubscribe = db
            .collection('chats')
            .doc(finalConversationID)
            .collection("messages")
            .orderBy('createdAt', 'desc')
            .onSnapshot(snapshot => setMessages(
                snapshot.docs.map(doc => ({
                    _id: doc.data()._id,
                    createdAt: doc.data().createdAt.toDate(),
                    text: doc.data().text,
                    user: doc.data().user
                }))
            ))
        return unsubscribe;
    }, []);


    return (
        <>
            <GiftedChat
                messages={messages}
                showAvatarForEveryMessage={true}
                onSend={messages => onSend(memberData.conversationID, memberData.ID, messages)}
                user={{
                    _id: auth?.currentUser?.email,
                    name: auth?.currentUser?.displayName,
                    avatar: auth?.currentUser?.photoURL
                }}
                onPressAvatar={() => setProfileModalVisible(true)}
            />
            <ProfileModal modalVisible={ProfileModalVisible} setModalVisible={setProfileModalVisible} memberID={memberData.ID}/>
        </>
    )
}

export default MessagesScreen;

const style = StyleSheet.create({
    safeArea: {
        backgroundColor: '#191919',
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
        borderColor: '#252525',
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
        right: 0,
        tintColor: '#FDAF01',
        zIndex: 100
    },



})
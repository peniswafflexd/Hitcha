import React, {useCallback, useLayoutEffect, useState} from 'react';
import {Image, Pressable, SafeAreaView, Text, View} from 'react-native';
import {GiftedChat} from "react-native-gifted-chat";
import {auth, db, getConversationID, sendMessage} from "../API/RouteAPI";
import ProfileModal from "../ProfileModal";


function MessagesScreen({navigation, memberData, ...props}) {
    return (
        <SafeAreaView style={{backgroundColor: '#191919', top: 0, height: '100%', width: '100%'}}>
            <View style={{flex: 0.10, flexDirection: 'row', alignItems: 'center',}}>
                <Image source={{uri: memberData.photo}}
                       style={{
                           width: 80,
                           height: 80,
                           borderRadius: 40,
                           borderWidth: 2,
                           borderColor: '#252525',
                           margin: 10,
                           marginTop: 30
                       }}/>
                <Text style={{
                    flex: 1,
                    left: 10,
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: 24,
                }}>{memberData.name.split(' ')[0]}</Text>
                <View style={{flex: 0.1, right: 10, zIndex: 100}}>
                    <Pressable onPress={navigation}>
                        <Image
                            source={require('../../assets/icons/messages.png')}
                            resizeMode={"contain"}
                            style={{
                                width: 32,
                                height: 32,
                                right: 0,
                                tintColor: '#FDAF01',
                                zIndex: 100
                            }}
                        />
                    </Pressable>
                </View>
            </View>
            <Messages memberData={memberData} {...props}/>
        </SafeAreaView>
    )
}

const Messages = ({memberData}) => {
    let finalConversationID = (memberData?.conversationID) ? memberData?.conversationID : getConversationID(memberData?.ID, memberData?.name, memberData?.photo)
    const [messages, setMessages] = useState([]);
    const [ProfileModalVisible, setProfileModalVisible] = useState(false);

    const onSend = useCallback((conversationID, memberID, messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
        sendMessage(messages, conversationID, memberID);
    }, [])

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
import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {Image, Pressable, SafeAreaView, Text, View} from 'react-native';
import {GiftedChat} from "react-native-gifted-chat";
import {auth, db} from "../API/RouteAPI";


function MessagesScreen({navigation}) {
    return (
        <SafeAreaView style={{backgroundColor: '#191919', top: 0, height: '100%', width: '100%'}}>
            <View style={{flex: 0.10, flexDirection: 'row', alignItems: 'center',}}>
                <Text style={{flex: 1, left: 10, color: 'white', fontWeight: 'bold', fontSize: 24,}}>Julia</Text>
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
                <Messages/>
        </SafeAreaView>
)
}

const Messages = () =>
    {
        const [messages, setMessages] = useState([]);


        useLayoutEffect(() => {
               const unsubscribe = db
                    .collection('chats')
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


        const onSend = useCallback((messages = []) => {
            setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
            const {
                _id,
                createdAt,
                text,
                user
            } = messages[0]
            db.collection('chats').add({
                _id,
                createdAt,
                text,
                user
            })
        }, [])

        return (
            <GiftedChat
                messages={messages}
                showAvatarForEveryMessage={true}
                onSend={messages => onSend(messages)}
                user={{
                    _id: auth?.currentUser?.email,
                    name: auth?.currentUser?.displayName,
                    avatar: auth?.currentUser?.photoURL
                }}
            />
        )
    }

export default MessagesScreen;
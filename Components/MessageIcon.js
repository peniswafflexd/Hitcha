import React, {useState} from 'react';
import {Image, Pressable, ScrollView, StyleSheet, Text, View} from "react-native";
import Modal from "react-native-modal";
import MessagesScreen from "./Screens/MessagesScreen";
import {getAllConversationUsers, readMessage} from "./API/RouteAPI";

const ModalController = (setModalVisible, modalVisible) => {
    setModalVisible(!modalVisible);
}

export const MessageModal = ({
                                 setModalVisible,
                                 modalVisible,
                                 initialScreenConversation = true,
                                 passedMemberData,
                                 memberID,
                                 memberName,
                                 memberPhoto
                             }) => {
    const navigation = () => {
        setConversationScreen(!conversationScreen)
    }
    // const [conversationID, setConversationID] = useState(undefined);
    const [conversationScreen, setConversationScreen] = useState(initialScreenConversation);
    // const [callbackMemberID, setCallbackMemberID] = useState(memberID)
    const [memberData, setMemberData] = useState(passedMemberData);

    return (
        <Modal isVisible={modalVisible} animationIn={"bounceIn"} animationOut={"bounceOut"}
               onBackdropPress={() => setModalVisible(!modalVisible)}
               style={{
                   alignItems: 'center',
                   margin: conversationScreen ? 10 : 0
               }}>
            {conversationScreen ? <Conversations navigation={navigation} setMemberData={setMemberData}/> :
                <Chat navigation={navigation} memberData={memberData} />}
        </Modal>
    )
}

const Conversations = ({navigation, ...props}) => {
    return (
        <View style={{
            height: '50%',
            width: '95%',
            backgroundColor: '#252525',
            borderRadius: 10,
            top: '-12%',
            flexDirection: 'column',
        }}>
            <ScrollView style={{
                flex: 0.8,
                borderTopRightRadius: 10,
                borderTopLeftRadius: 10,
            }}>
                {/*<Text style={{color: 'white'}}>All messages go here</Text>*/}
                <ConversationList {...props} navigation={navigation}/>
            </ScrollView>

            <View style={{
                flex: 0.2,
                borderBottomRightRadius: 10,
                borderBottomLeftRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
                borderTopWidth: 0.3,
                borderTopColor: "#4D4B4B"
            }}>
                <Text style={{color: '#FDAF01'}} onPress={navigation}>View All Messages</Text>
            </View>
        </View>
    )
}

const ConversationList = ({setMemberData, navigation}) => {
    const [conversations, setConversations] = useState([]);
    getAllConversationUsers(conversations, setConversations)
    return conversations.map((c) =>
        <Pressable key={c.id} onPress={() => {
            // setConversationID(c.data().conversationID)
            // setCallbackMemberID(c.id)
            setMemberData({
                conversationID: c.data().conversationID,
                ID: c.id,
                photo: c.data().photoURL,
                name: c.data().name,
                message: c.data().message,
                unread: c.data().unread
            })
            readMessage(c.id)
            navigation();
        }}>
            <View style={{
                // backgroundColor: 'grey',
                height: 75,
                borderBottomWidth: 0.5,
                borderColor: 'white',
                padding: 5,
                flexDirection: 'row'
            }}>
                <Image style={{height: 60, width: 60, borderRadius: 30, flex: 0.2}}
                       source={{uri: c.data().photoURL}}/>
                <View style={{flexDirection: 'column', flex: 0.8, padding: 5, overflow: 'hidden'}}>
                    <Text style={{
                        color: c.data().unread ? '#FDAF01' : 'white',
                        fontWeight: 'bold',
                        fontSize: 18
                    }}>{c.data().name}</Text>
                    <Text style={{
                        color: 'white',
                        fontWeight: c.data().unread ? 'bold' : 'normal',
                        fontSize: 12
                    }}>{c.data().message}</Text>
                </View>

            </View>
        </Pressable>
    )
}

const Chat = ({...props}) => {
    return <MessagesScreen {...props}/>
}

const MessageIcon = () => {
    const [modalVisible, setModalVisible] = useState(false);
    return <View style={{flex: 0.1, right: 10, zIndex: 100}}>
        <Pressable onPress={() => ModalController(setModalVisible, modalVisible)}>
            <Image
                source={require('../assets/icons/messages.png')}
                resizeMode={"contain"}
                style={{
                    width: 32,
                    height: 32,
                    right: 0,
                    tintColor: modalVisible ? '#FDAF01' : '#FFFFFF',
                    zIndex: 100
                }}
            />
        </Pressable>
        <MessageModal setModalVisible={setModalVisible} modalVisible={modalVisible}/>
    </View>
}

export default MessageIcon;

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // marginTop: 22
    },
    modalView: {
        margin: 10,
        top: 0,
        backgroundColor: "#252525",
        borderRadius: 20,
        padding: '30%',
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
});

import React, {useState} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from "react-native";
import Modal from "react-native-modal";
import MessagesScreen from "./Screens/MessagesScreen";
import {getConversationID} from "./API/RouteAPI";

const ModalController = (setModalVisible, modalVisible) => {
    setModalVisible(!modalVisible);
}

export const MessageModal = ({setModalVisible, modalVisible, initialScreenConversation= true, memberID, memberName}) => {
    let conversationID = getConversationID(memberID, memberName)
    const navigation = () => {
        setConversationScreen(!conversationScreen)
    }
    const [conversationScreen, setConversationScreen] = useState(initialScreenConversation);
    return (
        <Modal isVisible={modalVisible} animationIn={"bounceIn"} animationOut={"bounceOut"}
               onBackdropPress={() => setModalVisible(!modalVisible)}
               style={{
                   alignItems: 'center',
                   margin: conversationScreen ? 10 : 0
               }}>
            {conversationScreen ? <Conversations navigation={navigation}/> : <Chat navigation={navigation} conversationID={conversationID}/>}
        </Modal>
    )
}

const Conversations = ({navigation}) => {
    return (
        <View style={{
            height: '50%',
            width: '95%',
            backgroundColor: '#252525',
            borderRadius: 10,
            top: '-12%',
            flexDirection: 'column',
        }}>
            <View style={{
                flex: 0.8,
                borderTopRightRadius: 10,
                borderTopLeftRadius: 10,
            }}>
                <Text style={{color: 'white'}}>All messages go here</Text>
            </View>

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

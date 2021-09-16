import React, {useState} from 'react';
import {Image, Pressable, ScrollView, StyleSheet, Text, View} from "react-native";
import Modal from "react-native-modal";
import MessagesScreen from "./Screens/MessagesScreen";
import {getAllConversationUsers, readMessage} from "./API/RouteAPI";
import {colors} from "../Styles/GlobalStyles"
import CustomFastImage from "./CustomFastImage";

/**
 * sets whether the conversation modal is visible
 * @param setModalVisible - function to set modalVisible state
 * @param modalVisible - state of modal being visible
 * @constructor
 */
const ModalController = (setModalVisible, modalVisible) => {
    setModalVisible(!modalVisible);
}

/**
 * Modal that shows either the conversation list, or resizes
 * to show the messages screen.
 * @param setModalVisible - function to set whether modal is visible or not
 * @param modalVisible - whether modal is visible or not
 * @param initialScreenConversation - whether the initial screen should be conversation list or message screen
 * @param passedMemberData - memberData if initial screen is to be message screen
 * @returns {JSX.Element}
 * @constructor
 */
export const MessageModal = ({
                                 setModalVisible,
                                 modalVisible,
                                 initialScreenConversation = true,
                                 passedMemberData,
                             }) => {
    //just changes the screen between message screen and conversation screen
    const navigation = () => {
        setConversationScreen(!conversationScreen)
    }

    const [conversationScreen, setConversationScreen] = useState(initialScreenConversation);
    const [memberData, setMemberData] = useState(passedMemberData);

    return (
        <Modal isVisible={modalVisible}
               animationIn={"bounceIn"}
               animationOut={"bounceOut"}
               onBackdropPress={() => setModalVisible(!modalVisible)}
               style={{alignItems: 'center', margin: conversationScreen ? 10 : 0}}>

            {/*if conversation screen is true then show conversations, else go to chat screen*/}
            {conversationScreen ?
                <Conversations navigation={navigation} setMemberData={setMemberData}/> :
                <MessagesScreen navigation={navigation} memberData={memberData}/>
                // <Chat navigation={navigation} memberData={memberData} />
            }
        </Modal>
    )
}

/**
 * styling for the modal and a scrollView that holds the conversationList
 * @param navigation - function to switch between conversations and messages screens
 * @param props - props to be passed to the conversation list.
 * @returns {JSX.Element}
 * @constructor
 */
const Conversations = ({navigation, ...props}) => {
    return (
        <View style={styles.conversationsModal}>
            <ScrollView style={styles.conversationsScroll}>
                <ConversationList {...props} navigation={navigation}/>
            </ScrollView>

            {/*TODO: decide if i want to delete this*/}
            {/*<View style={{*/}
            {/*    flex: 0.2,*/}
            {/*    borderBottomRightRadius: 10,*/}
            {/*    borderBottomLeftRadius: 10,*/}
            {/*    alignItems: 'center',*/}
            {/*    justifyContent: 'center',*/}
            {/*    borderTopWidth: 0.3,*/}
            {/*    borderTopColor: "#4D4B4B"*/}
            {/*}}>*/}
            {/*    <Text style={{color: colors.primary}} onPress={navigation}>View All Messages</Text>*/}
            {/*</View>*/}
        </View>
    )
}

/**
 * A list of all the conversations the user currently has
 * @param setMemberData - function to set memberData once conversation has been selected
 * @param navigation - function to change between this screen and messages screen.
 * @returns {unknown[]} - list of pressable views containing a conversation.
 * @constructor
 */
const ConversationList = ({setMemberData, navigation}) => {
    const [conversations, setConversations] = useState([]);
    getAllConversationUsers(conversations, setConversations)
    return conversations.map((c) =>
        <Pressable key={c.id} onPress={() => {
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
            <View style={styles.conversationRow}>
                <CustomFastImage style={{height: 60, width: 60, borderRadius: 30, flex: 0.2}} source={{uri: c.data().photoURL}}/>
                <View style={{flexDirection: 'column', flex: 0.8, padding: 5, overflow: 'hidden'}}>
                    <Text style={[styles.memberName, {color: c.data().unread ? colors.primary : 'white'}]}>
                        {c.data().name}
                    </Text>
                    <Text style={[styles.messageText,{fontWeight: c.data().unread ? 'bold' : 'normal'}]}>
                        {c.data().message}
                    </Text>
                </View>

            </View>
        </Pressable>
    )
}

//TODO: test whether i can celeted this.
const Chat = ({...props}) => {
    return <MessagesScreen {...props}/>
}

/**
 * Icon that when click opens and closes the messages modal
 * @returns {JSX.Element}
 * @constructor
 */
const MessageIcon = () => {
    const [modalVisible, setModalVisible] = useState(false);
    return <View style={{flex: 0.1, right: 10, zIndex: 100}}>
        <Pressable onPress={() => ModalController(setModalVisible, modalVisible)}>
            <Image
                source={require('../assets/icons/messages.png')}
                resizeMode={"contain"}
                style={[styles.messageIcon, {tintColor: modalVisible ? colors.primary : '#FFFFFF'}]}
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
    },
    conversationsModal: {
        height: '50%',
        width: '95%',
        backgroundColor: colors.mediumBlack,
        borderRadius: 10,
        top: '-12%',
        flexDirection: 'column',
    },
    conversationsScroll: {
        flex: 0.8,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
    },
    conversationRow: {
        height: 75,
        borderBottomWidth: 0.5,
        borderColor: 'white',
        padding: 5,
        flexDirection: 'row'
    },
    memberName: {
        fontWeight: 'bold',
        fontSize: 18
    },
    messageText: {
        color: 'white',
        fontSize: 12
    },
    messageIcon: {
        width: 32,
        height: 32,
        right: 0,
        zIndex: 100
    }

});

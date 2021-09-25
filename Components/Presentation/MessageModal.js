import React, {useState} from "react";
import Modal from "react-native-modal";
import MessagesScreen from "../Screens/MessagesScreen";
import {ScrollView, StyleSheet, View} from "react-native";
import {colors} from "../../Styles/GlobalStyles";
import {ConversationList} from "../Business/ConversationList";

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
        </View>
    )
}

const styles = StyleSheet.create({
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

})
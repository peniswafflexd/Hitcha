import {getConversationID, getMessagesSnapshot, sendMessage} from "./API/MessagesAPI";
import React, {useCallback, useState} from "react";
import {GiftedChat} from "react-native-gifted-chat";
import {auth} from "./API/APIConstants";
import ProfileModal from "./ProfileModal";

/**
 * logic for the messages that are being sent and received
 * @param memberData - data for the member that is being messaged
 * @returns {JSX.Element}
 * @constructor
 */
export const Messages = ({memberData}) => {
    //if the conversationID isn't passed through then determine the conversationID from the member ID
    let finalConversationID = (memberData?.conversationID) ? memberData?.conversationID : getConversationID(memberData?.ID, memberData?.name, memberData?.photo)
    const [messages, setMessages] = useState([]);
    //this is used for when the user clicks on the members avatar, so it will show their profile.
    const [ProfileModalVisible, setProfileModalVisible] = useState(false);

    //callback for when the send button is pressed.
    const onSend = useCallback((conversationID, memberID, messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
        sendMessage(messages, conversationID, memberID);
    }, [])
    getMessagesSnapshot(finalConversationID, setMessages)
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
            <ProfileModal modalVisible={ProfileModalVisible} setModalVisible={setProfileModalVisible}
                          memberID={memberData.ID}/>
        </>
    )
}
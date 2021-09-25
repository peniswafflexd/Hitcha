import React, {useState} from "react";
import {getAllConversationUsers, readMessage} from "../API/MessagesAPI";
import {Pressable, StyleSheet, Text, View} from "react-native";
import CustomFastImage from "../Presentation/CustomFastImage";
import {colors} from "../../Styles/GlobalStyles";

/**
 * A list of all the conversations the user currently has
 * @param setMemberData - function to set memberData once conversation has been selected
 * @param navigation - function to change between this screen and messages screen.
 * @returns {unknown[]} - list of pressable views containing a conversation.
 * @constructor
 */
export const ConversationList = ({setMemberData, navigation}) => {
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
                <CustomFastImage style={{height: 60, width: 60, borderRadius: 30, flex: 0.2}}
                                 source={{uri: c.data().photoURL}}/>
                <View style={{flexDirection: 'column', flex: 0.8, padding: 5, overflow: 'hidden'}}>
                    <Text style={[styles.memberName, {color: c.data().unread ? colors.primary : 'white'}]}>
                        {c.data().name}
                    </Text>
                    <Text style={[styles.messageText, {fontWeight: c.data().unread ? 'bold' : 'normal'}]}>
                        {c.data().message}
                    </Text>
                </View>

            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
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
})
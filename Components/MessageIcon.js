import React, {useState} from 'react';
import {Image, Pressable, StyleSheet, View} from "react-native";
import {colors} from "../Styles/GlobalStyles"
import {MessageModal} from "./MessageModal";
import {hasUnreadMessage} from "./API/MessagesAPI";


/**
 * Icon that when click opens and closes the messages modal
 * @returns {JSX.Element}
 * @constructor
 */
const MessageIcon = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [unread, setUnread] = useState(false);
    hasUnreadMessage(setUnread)
    let icon = unread ? require(`../assets/icons/messageUnread.png`) : require(`../assets/icons/messages.png`)
    return <View style={{flex: 0.1, right: 10, zIndex: 100}}>
        <Pressable onPress={() => setModalVisible(!modalVisible)}>
            <Image
                source={icon}
                resizeMode={"contain"}
                style={[styles.messageIcon, {tintColor: modalVisible ? colors.primary : null}]}
            />
        </Pressable>
        <MessageModal setModalVisible={setModalVisible} modalVisible={modalVisible}/>
    </View>
}

export default MessageIcon;

const styles = StyleSheet.create({
    messageIcon: {
        width: 32,
        height: 32,
        right: 0,
        zIndex: 100
    }

});

import React, {useState} from 'react';
import {Image, Pressable, StyleSheet, View} from "react-native";
import {colors} from "../Styles/GlobalStyles"
import {MessageModal} from "./MessageModal";


/**
 * Icon that when click opens and closes the messages modal
 * @returns {JSX.Element}
 * @constructor
 */
const MessageIcon = () => {
    const [modalVisible, setModalVisible] = useState(false);
    return <View style={{flex: 0.1, right: 10, zIndex: 100}}>
        <Pressable onPress={() => setModalVisible(!modalVisible)}>
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
    messageIcon: {
        width: 32,
        height: 32,
        right: 0,
        zIndex: 100
    }

});

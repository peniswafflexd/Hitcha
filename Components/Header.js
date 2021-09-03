import React from 'react'
import {Text, View} from "react-native";
import MessageIcon from "./MessageIcon";


const Header = ({title, textStyle, style, messageIcon = true}) => {
    let messageIconComponent = messageIcon ? <MessageIcon/> : null
    return (
        <View style={{flex: 0.10, flexDirection: 'row', alignItems: 'center', ...style }}>
            <Text style={{flex: 1, left: 10, color: 'white', fontWeight: 'bold', fontSize: 24, ...textStyle}}>{title}</Text>
            {messageIconComponent}
        </View> );
}
export default Header
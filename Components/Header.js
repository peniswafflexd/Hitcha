import React from 'react'
import {Text, View} from "react-native";
import MessageIcon from "./MessageIcon";

/**
 * a header that is used on every screen
 * @param title - title of screen
 * @param textStyle - style props to be passed to title text
 * @param style - style props to be based to header view
 * @param messageIcon - component to be used for message icon
 * @returns {JSX.Element}
 * @constructor
 */
const Header = ({title, textStyle, style, messageIcon = true}) => {
    let messageIconComponent = messageIcon ? <MessageIcon/> : null
    return (
        <View style={{flex: 0.10, flexDirection: 'row', alignItems: 'center', ...style}}>
            <Text style={{
                flex: 1,
                left: 10,
                color: 'white',
                fontWeight: 'bold',
                fontSize: 24, ...textStyle
            }}>{title}</Text>
            {messageIconComponent}
        </View>);
}
export default Header
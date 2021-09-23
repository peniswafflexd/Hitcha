import Pressable from "react-native/Libraries/Components/Pressable/Pressable";
import {Text, View} from "react-native";
import React from "react";


/**
 * a custom button thats used throughout the application.
 * @param color - color of button
 * @param text - button text
 * @param buttonStyle - style props to pass to button
 * @param textStyle - style props to pass to text
 * @param onPress - function callback for when button tapped
 * @param flex - flex for the component
 * @returns {JSX.Element}
 * @constructor
 */
const CustomButton = ({color, text, buttonStyle, textStyle, onPress, flex = 1}) => {
    return <Pressable onPress={onPress} style={{flex: flex}}>
        <View style={{
            height: '55%',
            backgroundColor: color,
            margin: 15,
            overflow: 'hidden',
            borderRadius: 6,
            justifyContent: 'center',
            ...buttonStyle
        }}>
            <Text style={{color: 'white', textAlign: 'center', fontWeight: 'bold', ...textStyle}}> {text} </Text>
        </View>
    </Pressable>
}

export default CustomButton;
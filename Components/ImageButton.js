import {ImageBackground, Pressable, StyleSheet, Text, View} from "react-native";
import {globalStyles} from "../Styles/GlobalStyles";
import React from "react";

/**
 * a custom image button, where the image is tappable and has text
 * @param image - image to use for button
 * @param title - button text
 * @param onPress - function callback for when button tapped.
 * @returns {JSX.Element}
 * @constructor
 */
export const ImageButton = ({image, title, onPress}) => {
    return <View style={{flex: 1, margin: 10, zIndex: 0}}>
        <Pressable onPress={onPress}>
            <ImageBackground source={image} style={styles.ImageButton}>
                <View style={styles.ImageButtonOverlay}/>
                <Text style={globalStyles.screenTitle}>{title}</Text>
            </ImageBackground>
        </Pressable>
    </View>
}

const styles = StyleSheet.create({
    ImageButton: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        overflow: 'hidden',
        zIndex: 0
    },
    ImageButtonOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        opacity: 0.4,
        backgroundColor: 'black',
        height: '100%',
        width: '100%',
        zIndex: 0
    },
})
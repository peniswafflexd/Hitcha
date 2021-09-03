import React from 'react';
import { StyleSheet } from 'react-native';
import {
    DMSans_400Regular,
    DMSans_400Regular_Italic,
    DMSans_500Medium,
    DMSans_500Medium_Italic,
    DMSans_700Bold,
    DMSans_700Bold_Italic
} from '@expo-google-fonts/dm-sans'
import {
    Roboto_100Thin,
    Roboto_100Thin_Italic,
    Roboto_300Light,
    Roboto_300Light_Italic,
    Roboto_400Regular,
    Roboto_400Regular_Italic,
    Roboto_500Medium,
    Roboto_500Medium_Italic,
    Roboto_700Bold,
    Roboto_700Bold_Italic,
    Roboto_900Black,
    Roboto_900Black_Italic,
} from '@expo-google-fonts/roboto'


export const styles = StyleSheet.create({
    screenTitle: {
        fontSize: 20,
        color: "#FFFFFF",
        position: 'absolute',
        left: 25,
        top: 50,
    },
    normalText: {
        fontSize: 14,
        color: "#FFFFFF",
        // fontFamily: 'Roboto-Thin'
    }
});

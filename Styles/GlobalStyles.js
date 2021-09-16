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

export const colors = {
    primary: '#FDAF01',
    darkBlack: '#191919',
    mediumBlack: '#252525',
    lightBlack: '#413F3F',
    lightText: '#C1C1C1'
}
export const globalStyles = StyleSheet.create({
    screenTitle: {
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    normalText: {
        fontSize: 14,
        color: "#FFFFFF",
        // fontFamily: 'Roboto-Thin'
    },
    // colors: {
    //     primary: colors.primary,
    //     darkBlack: colors.darkBlack,
    //     mediumBlack: colors.mediumBlack,
    //     lightBlack: '#413F3F',
    //     lightText: colors.lightText
    //
    // }
});

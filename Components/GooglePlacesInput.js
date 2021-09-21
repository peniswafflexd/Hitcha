import {colors} from "../Styles/GlobalStyles";
import {Text, View} from "react-native";
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";
import React from "react";
import {GoogleAPIKey} from "./API/APIConstants";

/**
 * Re-usable component for google places auto-complete box.
 * @param text - text to be displayed above the input
 * @param textStyle - style of being displayed above the input
 * @param flex - vertical flex for container to use
 * @param onPress - call back function for tapping a completion
 * @param zIndex - the zIndex for the component
 * @returns {JSX.Element}
 * @constructor
 */
export const GooglePlacesInput = ({text, textStyle, flex, onPress, zIndex}) => {
    return (<View style={{flex: flex, position: 'fixed', zIndex: zIndex}}>
            <Text style={{color: 'white', ...textStyle}}>{text}</Text>
            <GooglePlacesAutocomplete
                placeholder='Enter Location'
                onPress={onPress}
                minLength={3}
                fetchDetails={true}
                enablePoweredByContainer={false}
                GooglePlacesSearchQuery={{
                    // gets the place name and coordinate information from google maps API
                    types: 'gecode'
                }}
                textInputProps={{placeholderTextColor: colors.lightText}}
                query={{
                    // API KEY
                    key: GoogleAPIKey,
                    language: 'en',
                }}
                styles={googlePlacesStyle}
            />
        </View>
    );
}
const googlePlacesStyle = {
    container: {
        flex: 0
    },
    textInputContainer: {
        width: '75%',
        marginTop: 10
    },
    textInput: {
        height: 38,
        color: colors.lightText,
        fontSize: 16,
        backgroundColor: '#413F3F',
        borderRadius: 10,
    },
    listView: {
        width: '89%',
        borderRadius: 10,
        height: 100
    },
    row: {
        backgroundColor: colors.mediumBlack,
    },
    description: {
        color: colors.lightText
    }
}
import React from 'react';
import { View, SafeAreaView } from 'react-native';
import {colors} from "../../Styles/GlobalStyles";
import Map from "../Map"
import Header from "../Header";

/**
 * The map screen, only holds the header and basic style, the rest
 * of the map logic is in the "Map" component
 * @returns {JSX.Element}
 * @constructor
 */
function MapScreen() {
    return <SafeAreaView style={{backgroundColor: colors.darkBlack, height: '98%' }}>
           <Header title={"Catch a Ride"}/>
            <View style={{flex: 0.85, backgroundColor: '#00ff00'}}>
                <Map/>
            </View>
        </SafeAreaView>
}

export default MapScreen;
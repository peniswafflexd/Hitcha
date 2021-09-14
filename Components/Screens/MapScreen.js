import React from 'react';
import { StyleSheet, Text, View, Button, SafeAreaView } from 'react-native';
import {globalStyles} from "../../Styles/GlobalStyles";
import MessageIcon from "../MessageIcon";
import Map from "../Map"
import Header from "../Header";


function MapScreen() {
    return <SafeAreaView style={{backgroundColor: '#191919', height: '98%' }}>
           <Header title={"Catch a Ride"}/>
            <View style={{flex: 0.85, backgroundColor: '#00ff00'}}>
                <Map/>
            </View>
        </SafeAreaView>
}

export default MapScreen;
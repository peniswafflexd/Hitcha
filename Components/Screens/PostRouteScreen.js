import React, {useState} from 'react';
import {Image, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {addRoute, auth} from '../API/RouteAPI'
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Header from "../Header";
import CustomButton from "../CustomButton";
import {CustomSwitch} from "../CustomSwitch";


const GooglePlacesInput = ({text, textStyle, flex, onPress}) => {
    return (<View style={{flex: flex}}>
            <Text style={{color: 'white', ...textStyle}}>{text}</Text>
            <GooglePlacesAutocomplete
                placeholder='Enter Location'
                onPress={onPress}
                fetchDetails={true}
                GooglePlacesSearchQuery={{
                    // gets the place name and coordinate information from google maps API
                    types: 'gecode'
                }}
                textInputProps={{placeholderTextColor: '#C1C1C1'}}
                query={{
                    // API KEY
                    key: 'AIzaSyDFlHhJbSiC2PhIbGT0o6kl0FfBKfh9LP8',
                    language: 'en',
                }}
                styles={googlePlacesStyle}
            />
        </View>
    );
}

function PostRouteScreen({navigation}) {
    const [routeLocations, setRouteLocations] = useState({
        Name: auth?.currentUser?.displayName,
        Photo: auth?.currentUser?.photoURL,
        Start: {
            lat: 0,
            lng: 0
        },
        End: {
            lat: 0,
            lng: 0
        }
    })
    return (
        <SafeAreaView style={style.safeArea}>
            <Header title={"Post a Route"}/>
            <View style={{flex: 0.85, flexDirection: 'column', padding: 20}}>
                <GooglePlacesInput
                    text={"Where are you starting?"}
                    flex={0.2}
                    onPress={(data, details = null) => {
                        // sets the start route locations
                        setRouteLocations({
                            ...routeLocations,
                            Start: details.geometry.location,
                            StartName: details.address_components[0].long_name
                        })
                    }}
                />

                <IconWithText icon={require("../../assets/icons/add.png")} text={"add via destination"}/>

                <GooglePlacesInput
                    text={"Where are you going?"}
                    flex={0.2}
                    onPress={(data, details = null) => {
                        // add route data to the routeLocations state
                        setRouteLocations({
                            ...routeLocations,
                            End: details.geometry.location,
                            EndName: details.address_components[0].long_name
                        })
                    }}
                />
                <CustomSwitch text={"Use GPS Location Instead"} style={{marginTop: 20}}/>
                <CustomSwitch text={"Only show my route to users with at least one ride"}/>

            </View>
            <View style={{height: '15%', flexDirection: 'row'}}>
                <CustomButton color={'transparent'} text={"Cancel"}
                              buttonStyle={{borderWidth: 1, borderColor: 'white'}}
                              onPress={() => navigation.goBack()}
                />
                <View style={{flex: 0.4, height: '100%'}}/>
                <CustomButton color={'#FDAF01'} text={"Continue"} onPress={() => addRoute(routeLocations)}/>
            </View>
        </SafeAreaView>
    );
}

const IconWithText = ({icon, text}) => {
    return (
        <View style={{justifyContent: 'left', alignItems: 'center', flexDirection: "row", flex: 0.15}}>
            <Image source={icon}
                   resizeMode={'contain'}
                   style={{tintColor: '#FDAF01', width: 32, height: 32, marginRight: 10}}/>
            <Text style={{color: 'white'}}>
                {text}
            </Text>
        </View>
    )
}

export default PostRouteScreen;

const style = StyleSheet.create({
    safeArea: {
        backgroundColor: '#191919',
        height: '100%'
    },



})

const googlePlacesStyle =  {
    textInputContainer: {
        width: '75%',
            marginTop: 10
    },
    textInput: {
        height: 38,
            color: '#C1C1C1',
            fontSize: 16,
            backgroundColor: '#413F3F',
            borderRadius: 10,
    },
    listView: {
        width: '89%',
            borderRadius: 10,
    },
    row: {
        backgroundColor: '#252525',
    },
    description: {
        color: '#C1C1C1'
    }
}
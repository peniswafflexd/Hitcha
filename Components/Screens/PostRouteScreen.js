import React, {useEffect, useState} from 'react';
import {Image, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {addRoute, auth} from '../API/RouteAPI'
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Header from "../Header";
import CustomButton from "../CustomButton";
import {CustomSwitch} from "../CustomSwitch";
import {colors} from "../../Styles/GlobalStyles"
import * as Location from 'expo-location';
import Geocoder from "react-native-geocoding"
import ModalLoader from "../ModalLoader";


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
const GooglePlacesInput = ({text, textStyle, flex, onPress, zIndex}) => {
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
                    key: 'AIzaSyDFlHhJbSiC2PhIbGT0o6kl0FfBKfh9LP8',
                    language: 'en',
                }}
                styles={googlePlacesStyle}
            />
        </View>
    );
}


/**
 * A screen for posting a route, takes input from google places auto-complete
 * input and uses it to get the coordinates of the places chosen.
 * @param navigation
 * @returns {JSX.Element}
 * @constructor
 */
function PostRouteScreen({navigation}) {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [useGPS, setUseGPS] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
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

    useEffect(() => {
        (async () => {
            setIsLoading(true)
            let {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
            setIsLoading(false)
        })();
    }, []);

    if (errorMsg) {
        alert(errorMsg);
    }
    return (
        <SafeAreaView style={style.safeArea}>
            <Header title={"Post a Route"}/>
            <View style={{flex: 0.85, flexDirection: 'column', padding: 20}}>
                {(!useGPS) ? <GooglePlacesInput
                    text={"Where are you starting?"}
                    flex={0.2}
                    zIndex={100}
                    onPress={(data, details = null) => {
                        // sets the start route locations
                        setRouteLocations({
                            ...routeLocations,
                            Start: details.geometry.location,
                            StartName: details.address_components[0].long_name
                        })
                    }}
                /> : <SetLocationFromGPS
                        location={location}
                        setRouteLocations={setRouteLocations}
                        routeLocations={routeLocations}
                        isLoading={isLoading}
                />}

                <IconWithText icon={require("../../assets/icons/add.png")} text={"add via destination"}/>

                <GooglePlacesInput
                    text={"Where are you going?"}
                    flex={0.2}
                    zIndex={99}
                    onPress={(data, details = null) => {
                        // add route data to the routeLocations state
                        setRouteLocations({
                            ...routeLocations,
                            End: details.geometry.location,
                            EndName: details.address_components[0].long_name
                        })
                    }}
                />
                <CustomSwitch text={"Use GPS Location Instead"} style={{marginTop: 20}}
                              callback={() => setUseGPS(!useGPS)}/>
                <CustomSwitch text={"Only show my route to users with at least one ride"}/>

            </View>
            <View style={{height: '15%', flexDirection: 'row'}}>
                <CustomButton color={'transparent'} text={"Cancel"}
                              buttonStyle={{borderWidth: 1, borderColor: 'white'}}
                              onPress={() => navigation.goBack()}
                />
                <View style={{flex: 0.4, height: '100%'}}/>
                <CustomButton color={colors.primary} text={"Continue"} onPress={() => {
                    addRoute(routeLocations)
                    navigation.goBack()
                }}/>
            </View>
        </SafeAreaView>
    );
}

/**
 * takes coordinates from GPS location and uses googles geocode API to
 * get the address data from it. Then sets the startLocation in the
 * routeLocation data
 * @param location - GPS coordinates
 * @param setRouteLocations - function to set routeLocation data
 * @param routeLocations - routeLocationData
 * @param isLoading - boolean for if the location data is back yet
 * @returns {JSX.Element|null}
 * @constructor
 */
const SetLocationFromGPS = ({location, setRouteLocations, routeLocations, isLoading}) => {
    if(isLoading) return <ModalLoader isLoading={isLoading}/>
    Geocoder.init("AIzaSyDFlHhJbSiC2PhIbGT0o6kl0FfBKfh9LP8", {language: "en"})
    useEffect(() => {
        Geocoder.from(location.coords.latitude, location.coords.longitude)
            .then(json => {
                let addressComponent = json.results[0].address_components[2].long_name
                setRouteLocations({
                    ...routeLocations,
                    Start: {
                        lat: location.coords.latitude,
                        lng: location.coords.longitude
                    },
                    StartName: addressComponent
                })
            })
            .catch(error =>
                console.warn(error)
            );
    }, [])
    return null
}

/**
 * re-usable component for an icon on the left with text on the right.
 * @param icon - icon to be used (must use require("path/to/icon.png") syntax)
 * @param text - text to be places on right of icon.
 * @returns {JSX.Element}
 * @constructor
 */
const IconWithText = ({icon, text}) => {
    return (
        <View style={{justifyContent: 'left', alignItems: 'center', flexDirection: "row", flex: 0.15}}>
            <Image source={icon}
                   resizeMode={'contain'}
                   style={{tintColor: colors.primary, width: 32, height: 32, marginRight: 10}}/>
            <Text style={{color: 'white'}}>
                {text}
            </Text>
        </View>
    )
}

export default PostRouteScreen;

const style = StyleSheet.create({
    safeArea: {
        backgroundColor: colors.darkBlack,
        height: '100%'
    },

})

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
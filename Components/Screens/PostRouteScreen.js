import React, {useEffect, useState} from 'react';
import {Image, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {addRoute} from '../API/RouteAPI'
import Header from "../Header";
import CustomButton from "../CustomButton";
import {CustomSwitch} from "../CustomSwitch";
import {colors} from "../../Styles/GlobalStyles"
import * as Location from 'expo-location';
import {auth} from "../API/APIConstants";
import {GooglePlacesInput} from "../GooglePlacesInput";
import {SetLocationFromGPS} from "../SetLocationFromGPS";


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
                {/*only display the google places input if the use GPS option is un-ticked */}
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


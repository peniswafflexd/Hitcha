import React, {useState} from 'react';
import {Image, SafeAreaView, Switch, Text, View} from 'react-native';
import {auth} from '../API/RouteAPI'
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import { addRoute } from "../API/RouteAPI";
import Header from "../Header";
import CustomButton from "../CustomButton";

const CustomSwitch = ({text, style}) => {
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    return (
        <View style={{
            justifyContent: 'left',
            alignItems: 'center',
            flexDirection: "row",
            flex: 0.15,
            ...style
        }}>
            <Switch
                trackColor={{false: "#767577", true: "#FDAF01"}}
                thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
                style={{
                    marginRight: 10
                }}
            />
            <Text style={{color: 'white', flexWrap: 'wrap', flex: 1}}>
                {text}
            </Text>
        </View>
    );
}


const GooglePlacesInput = ({text, textStyle, flex, onPress}) => {
    return (<View style={{flex: flex}}>
            <Text style={{color: 'white', ...textStyle}}>{text}</Text>
            <GooglePlacesAutocomplete
                placeholder='Enter Location'
                onPress={onPress}
                fetchDetails={true}
                GooglePlacesSearchQuery={{
                    // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                    types: 'gecode'
                }}
                textInputProps={{placeholderTextColor: '#C1C1C1'}}
                query={{
                    key: 'AIzaSyDFlHhJbSiC2PhIbGT0o6kl0FfBKfh9LP8',
                    language: 'en',
                }}
                styles={{
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
                }}
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
        <SafeAreaView style={{backgroundColor: '#191919', height: '100%'}}>
            <Header title={"Post a Route"}/>
            <View style={{flex: 0.85, flexDirection: 'column', padding: 20}}>
                <GooglePlacesInput
                    text={"Where are you starting?"}
                    flex={0.2}
                    onPress={(data, details = null) => {
                        // 'details' is provided when fetchDetails = true
                        setRouteLocations({...routeLocations,
                            Start: details.geometry.location,
                            StartName: details.address_components[0].long_name
                        })
                        // console.log(JSON.stringify(details));
                        console.log(details.address_components[0].long_name)
                    }}
                />

                <View style={{justifyContent: 'left', alignItems: 'center', flexDirection: "row", flex: 0.15}}>
                    <Image source={require("../../assets/icons/add.png")}
                           resizeMode={'contain'}
                           style={{tintColor: '#FDAF01', width: 32, height: 32, marginRight: 10}}/>
                    <Text style={{color: 'white'}}>
                        Add via Destination
                    </Text>
                </View>

                <GooglePlacesInput
                    text={"Where are you going?"}
                    flex={0.2}
                    onPress={(data, details = null) => {
                        // 'details' is provided when fetchDetails = true
                        setRouteLocations({...routeLocations,
                            End: details.geometry.location,
                            EndName: details.address_components[0].long_name
                        })
                        //console.log(details.geometry.location);
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
                <CustomButton color={'#FDAF01'} text={"Continue"} onPress={()=> addRoute(routeLocations)}/>
            </View>
        </SafeAreaView>
    );
}

export default PostRouteScreen;
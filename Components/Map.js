import React, {useState} from 'react';
import MapView, {PROVIDER_GOOGLE} from "react-native-maps";
import {getInformation, UpdatedRoutes} from "./API/RouteAPI";
import MapViewDirections from "react-native-maps-directions";
import {Image, Pressable, Text, View} from "react-native";
import CustomButton from "./CustomButton";
import {MessageModal} from "./MessageIcon";


const RenderedRoutes = ({routes, routeInformationCallback}) => {
    return routes.map((r) =>
        <MapViewDirections
            precision={"low"}
            strokeWidth={2}
            strokeColor={"#FDAF01"}
            tappable={true}
            onPress={() => routeInformationCallback(r.id)}
            key={r.id}
            origin={{latitude: r.data().Start.lat, longitude: r.data().Start.lng}}
            destination={{latitude: r.data().End.lat, longitude: r.data().End.lng}}
            apikey={"AIzaSyDFlHhJbSiC2PhIbGT0o6kl0FfBKfh9LP8"}
        />
    )
}

const Map = () => {
    const [routes, setRoutes] = useState([]);
    UpdatedRoutes(routes, setRoutes);
    const [routeFocused, setRouteFocused] = useState(false);
    const [routeInformationJSON, setRouteInformationJSON] = useState({});
    const [memberID, setMemberID] = useState(undefined);

    const displayRouteInformation = (userIdString) => {
        getInformation(userIdString).then(data => {
                setRouteInformationJSON(data)
                setRouteFocused(true)
                setMemberID(userIdString)
            }
        )
    }

    return (
        <>
            <MapView
                style={{
                    height: '100%',
                    width: '100%',
                    zIndex: 0
                }}
                initialRegion={{
                    latitude: -41.28664,
                    longitude: 174.77557,
                    latitudeDelta: 5,
                    longitudeDelta: 5,
                }}
                provider={PROVIDER_GOOGLE}
                customMapStyle={mapStyle}
            >
                <RenderedRoutes routes={routes} routeInformationCallback={displayRouteInformation}/>

            </MapView>
            <HelpDialog routeDisplay={routeFocused} routeInformation={routeInformationJSON}
                        setRouteDisplay={setRouteFocused} memberID={memberID}/>
        </>
    )
}

const HelpDialog = ({routeDisplay, routeInformation, ...props}) => {
    return (
        <>
            <View style={{
                backgroundColor: '#00000080',
                padding: 10,
                width: routeDisplay ? "95%" : '60%',
                height: routeDisplay ? "50%" : "15%",
                justifyContent: 'center',
                borderRadius: 20,
                position: 'absolute',
                bottom: 0,
                margin: 10,
            }}>
                {routeDisplay ? <HelpDialogContent routeInformation={routeInformation} {...props}/> :
                    <Text style={{fontSize: 16, color: '#FDAF01'}}>Tap a route for more information</Text>}
            </View>
        </>
    )
}

const HelpDialogContent = ({routeInformation, setRouteDisplay, memberID}) => {
    const [MessageScreen, setMessageScreen] = useState(false);

    return (
        <View style={{flexDirection: 'column', width: "100%", height: '100%'}}>
            <View style={{flex: 0.25, flexDirection: 'row', alignItems: 'center'}}>
                <Image style={{height: 60, width: 60, borderRadius: 30, flex: 0.2}}
                       source={{uri: routeInformation.Photo}}/>
                <Text style={{
                    left: '20%',
                    fontSize: 22,
                    textDecorationLine: "underline",
                    flex: 0.7,
                    color: 'white'
                }}>{routeInformation.Name}</Text>
                <Pressable style={{flex: 0.1, alignSelf: 'flex-start'}} onPress={() => setRouteDisplay(false)}>
                    <Image source={require('../assets/icons/close.png')}
                           resizeMode={"contain"}
                           style={{
                               width: 20,
                               height: 20,
                               right: 0,
                               tintColor: '#FDAF01',
                               zIndex: 100,
                           }}/>
                </Pressable>

            </View>
            <View style={{flex: 0.5, flexDirection: 'column', justifyContent: 'space-around'}}>
                <Text style={{color: 'white'}}>Destination: {routeInformation.EndName}</Text>
                <Text style={{color: 'white'}}>Start Location: {routeInformation.StartName}</Text>
                <Text style={{color: 'white'}}>Member ID: {memberID}</Text>
            </View>
            <View style={{flex: 0.25, flexDirection: 'row', padding: 0}}>
                <CustomButton color={'transparent'} text={"View Profile"}
                              buttonStyle={{
                                  borderWidth: 1,
                                  borderColor: 'white',
                                  height: '100%',
                                  margin: 0,
                                  marginRight: 5
                              }}
                />
                <CustomButton onPress={() => setMessageScreen(!MessageScreen)} color={'#FDAF01'} text={"Message"}
                              buttonStyle={{height: '100%', margin: 0, marginLeft: 5}}/>
            </View>
            <MessageModal modalVisible={MessageScreen} setModalVisible={setMessageScreen}
                          initialScreenConversation={false} memberID={memberID}
                          memberName={routeInformation.Name} memberPhoto={routeInformation.Photo}/>
        </View>
    )
}

const mapStyle = [
    {
        "elementType":
            "geometry",
        "stylers":
            [
                {
                    "color": "#1d2c4d"
                }
            ]
    }
    ,
    {
        "elementType":
            "labels.text.fill",
        "stylers":
            [
                {
                    "color": "#8ec3b9"
                }
            ]
    }
    ,
    {
        "elementType":
            "labels.text.stroke",
        "stylers":
            [
                {
                    "color": "#1a3646"
                }
            ]
    }
    ,
    {
        "featureType":
            "administrative.country",
        "elementType":
            "geometry.stroke",
        "stylers":
            [
                {
                    "color": "#4b6878"
                }
            ]
    }
    ,
    {
        "featureType":
            "administrative.land_parcel",
        "elementType":
            "labels.text.fill",
        "stylers":
            [
                {
                    "color": "#64779e"
                }
            ]
    }
    ,
    {
        "featureType":
            "administrative.province",
        "elementType":
            "geometry.stroke",
        "stylers":
            [
                {
                    "color": "#4b6878"
                }
            ]
    }
    ,
    {
        "featureType":
            "landscape.man_made",
        "elementType":
            "geometry.stroke",
        "stylers":
            [
                {
                    "color": "#334e87"
                }
            ]
    }
    ,
    {
        "featureType":
            "landscape.natural",
        "elementType":
            "geometry",
        "stylers":
            [
                {
                    "color": "#023e58"
                }
            ]
    }
    ,
    {
        "featureType":
            "poi",
        "elementType":
            "geometry",
        "stylers":
            [
                {
                    "color": "#283d6a"
                }
            ]
    }
    ,
    {
        "featureType":
            "poi",
        "elementType":
            "labels.text.fill",
        "stylers":
            [
                {
                    "color": "#6f9ba5"
                }
            ]
    }
    ,
    {
        "featureType":
            "poi",
        "elementType":
            "labels.text.stroke",
        "stylers":
            [
                {
                    "color": "#1d2c4d"
                }
            ]
    }
    ,
    {
        "featureType":
            "poi.park",
        "elementType":
            "geometry.fill",
        "stylers":
            [
                {
                    "color": "#023e58"
                }
            ]
    }
    ,
    {
        "featureType":
            "poi.park",
        "elementType":
            "labels.text.fill",
        "stylers":
            [
                {
                    "color": "#3C7680"
                }
            ]
    }
    ,
    {
        "featureType":
            "road",
        "elementType":
            "geometry",
        "stylers":
            [
                {
                    "color": "#304a7d"
                }
            ]
    }
    ,
    {
        "featureType":
            "road",
        "elementType":
            "labels.text.fill",
        "stylers":
            [
                {
                    "color": "#98a5be"
                }
            ]
    }
    ,
    {
        "featureType":
            "road",
        "elementType":
            "labels.text.stroke",
        "stylers":
            [
                {
                    "color": "#1d2c4d"
                }
            ]
    }
    ,
    {
        "featureType":
            "road.highway",
        "elementType":
            "geometry",
        "stylers":
            [
                {
                    "color": "#2c6675"
                }
            ]
    }
    ,
    {
        "featureType":
            "road.highway",
        "elementType":
            "geometry.stroke",
        "stylers":
            [
                {
                    "color": "#255763"
                }
            ]
    }
    ,
    {
        "featureType":
            "road.highway",
        "elementType":
            "labels.text.fill",
        "stylers":
            [
                {
                    "color": "#b0d5ce"
                }
            ]
    }
    ,
    {
        "featureType":
            "road.highway",
        "elementType":
            "labels.text.stroke",
        "stylers":
            [
                {
                    "color": "#023e58"
                }
            ]
    }
    ,
    {
        "featureType":
            "transit",
        "elementType":
            "labels.text.fill",
        "stylers":
            [
                {
                    "color": "#98a5be"
                }
            ]
    }
    ,
    {
        "featureType":
            "transit",
        "elementType":
            "labels.text.stroke",
        "stylers":
            [
                {
                    "color": "#1d2c4d"
                }
            ]
    }
    ,
    {
        "featureType":
            "transit.line",
        "elementType":
            "geometry.fill",
        "stylers":
            [
                {
                    "color": "#283d6a"
                }
            ]
    }
    ,
    {
        "featureType":
            "transit.station",
        "elementType":
            "geometry",
        "stylers":
            [
                {
                    "color": "#3a4762"
                }
            ]
    }
    ,
    {
        "featureType":
            "water",
        "elementType":
            "geometry",
        "stylers":
            [
                {
                    "color": "#0e1626"
                }
            ]
    }
    ,
    {
        "featureType":
            "water",
        "elementType":
            "labels.text.fill",
        "stylers":
            [
                {
                    "color": "#4e6d70"
                }
            ]
    }
]
export default Map
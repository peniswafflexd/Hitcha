import React, {useState} from 'react';
import MapView, {PROVIDER_GOOGLE} from "react-native-maps";
import {getRouteInformation, UpdatedRoutes} from "./API/RouteAPI";
import MapViewDirections from "react-native-maps-directions";
import {Image, Pressable, StyleSheet, Text, View} from "react-native";
import CustomButton from "./CustomButton";
import ProfileModal from "./ProfileModal";
import {colors} from "../Styles/GlobalStyles"
import CustomFastImage from "./CustomFastImage";
import {MessageModal} from "./MessageModal";
import {GoogleAPIKey} from "./API/APIConstants";


/**
 * Returns a list mapViewDirection components for MapView to render the routes.
 * @param routes - list of routes to render
 * @param routeInformationCallback - callback for when route is tapped.
 * @returns {*} - list mapViewDirection components for MapView as child components
 * @constructor
 */
const RenderedRoutes = ({routes, routeInformationCallback}) => {
    return routes.map((r) =>
            <MapViewDirections
                precision={"low"}
                strokeWidth={2}
                strokeColor={colors.primary}
                tappable={true}
                onPress={() => routeInformationCallback(r.id)}
                key={r.id+"route"}
                origin={{latitude: r.data().Start.lat, longitude: r.data().Start.lng}}
                destination={{latitude: r.data().End.lat, longitude: r.data().End.lng}}
                apikey={GoogleAPIKey}
            />
    )
}

const RenderedMarkers = ({routes, routeInformationCallback}) => {
    return routes.map((r) =>
        <MapView.Marker
            key={r.id + "marker"}
            coordinate={{latitude: r.data().End.lat, longitude: r.data().End.lng}}
            pinColor={colors.primary}
            onPress={() => routeInformationCallback(r.id)}
        />
    )
}


/**
 * The map component with routes rendered and a help dialog
 * @returns {JSX.Element}
 * @constructor
 */
const Map = () => {
    const [routes, setRoutes] = useState([]);
    UpdatedRoutes(routes, setRoutes);
    const [routeFocused, setRouteFocused] = useState(false);
    const [routeInformationJSON, setRouteInformationJSON] = useState({});
    const [memberData, setMemberData] = useState({});

    //the callback for when a route is tapped, updates the memberData, routeInformation
    //and the routeFocused state based on whichever route is tapped.
    const displayRouteInformation = (userIdString) => {
        getRouteInformation(userIdString).then(data => {
                setMemberData({
                    name: data.Name,
                    photo: data.Photo,
                    ID: userIdString
                })
                setRouteInformationJSON(data)
                setRouteFocused(true)
            }
        )
    }

    return (
        <>
            <MapView
                style={{height: '100%', width: '100%', zIndex: 0}}
                initialRegion={{
                    // initial region set to NZ
                    latitude: -41.28664,
                    longitude: 174.77557,
                    latitudeDelta: 5,
                    longitudeDelta: 5,
                }}
                provider={PROVIDER_GOOGLE}
                customMapStyle={mapStyle}
            >
                <RenderedRoutes routes={routes} routeInformationCallback={displayRouteInformation}/>
                <RenderedMarkers routes={routes} routeInformationCallback={displayRouteInformation}/>
            </MapView>
            <HelpDialog routeDisplay={routeFocused}
                        routeInformation={routeInformationJSON}
                        setRouteDisplay={setRouteFocused}
                        memberData={memberData}/>
        </>
    )
}

/**
 * will display a small modal with help text if no route selected.
 * Will display route information if route is selected.
 * @param routeDisplay - bool, whether or not a route is selected
 * @param routeInformation - data for the selected route
 * @param props - props to send to routeInformationContent component (memberData, etc)
 * @returns {JSX.Element}
 * @constructor
 */
const HelpDialog = ({routeDisplay, routeInformation, ...props}) => {
    return (
        <View style={[styles.helpModal, {width: routeDisplay ? "95%" : '60%', height: routeDisplay ? "50%" : "15%",}]}>
            {routeDisplay ? <RouteInformationContent routeInformation={routeInformation} {...props}/> :
                <Text style={{fontSize: 16, color: colors.primary}}>Tap a route for more information</Text>}
        </View>
    )
}

/**
 * Content for the helpDialog when a route is selected, displaying
 * route information, destination, route owner and buttons to contact
 * the route owner
 * @param routeInformation - selected route data
 * @param setRouteDisplay - function to switch if route is selected
 * @param memberData - data for member who owns the route.
 * @returns {JSX.Element}
 * @constructor
 */
const RouteInformationContent = ({routeInformation, setRouteDisplay, memberData}) => {
    const [MessageScreen, setMessageScreen] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    return (
        <View style={{flexDirection: 'column', width: "100%", height: '100%'}}>

            <View style={{flex: 0.25, flexDirection: 'row', alignItems: 'center'}}>
                <CustomFastImage style={styles.profilePhoto} source={{uri: routeInformation.Photo}}/>
                <Text style={styles.routeOwnerText}>{routeInformation.Name}</Text>
                <Pressable style={{flex: 0.1, alignSelf: 'flex-start'}} onPress={() => setRouteDisplay(false)}>
                    <Image source={require('../assets/icons/close.png')}
                           resizeMode={"contain"}
                           style={styles.closeIcon}/>
                </Pressable>
            </View>

            <View style={{flex: 0.5, flexDirection: 'column', justifyContent: 'space-around'}}>
                <Text style={{color: colors.primary}}>Destination:
                    <Text style={{color: 'white'}}>{"         " + routeInformation.EndName}</Text>
                </Text>
                <Text style={{color: colors.primary, marginBottom: 30}}>Start Location:
                    <Text style={{color: 'white'}}>{"     " + routeInformation.StartName}</Text>
                </Text>
            </View>

            <View style={{flex: 0.25, flexDirection: 'row', padding: 0}}>
                <CustomButton color={'transparent'}
                              text={"View Profile"}
                              buttonStyle={styles.viewProfileButton}
                              textStyle={{color: colors.primary}}
                              onPress={() => setShowProfile(true)}
                />
                <CustomButton onPress={() => setMessageScreen(!MessageScreen)}
                              color={colors.primary}
                              text={"Message"}
                              buttonStyle={styles.messageButton}/>
            </View>
            {/*these modals are shown if the message or profile buttons are pressed.*/}
            <MessageModal modalVisible={MessageScreen}
                          passedMemberData={memberData}
                          setModalVisible={setMessageScreen}
                          initialScreenConversation={false}/>
            <ProfileModal modalVisible={showProfile}
                          setModalVisible={setShowProfile}
                          setMessageScreen={setMessageScreen}
                          memberID={memberData.ID}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    helpModal: {
        backgroundColor: '#00000080',
        padding: 10,
        justifyContent: 'center',
        borderRadius: 20,
        position: 'absolute',
        bottom: 0,
        margin: 10,
    },
    closeIcon: {
        width: 20,
        height: 20,
        right: 0,
        tintColor: colors.primary,
        zIndex: 100,
    },
    routeOwnerText: {
        left: '20%',
        fontSize: 22,
        textDecorationLine: "underline",
        flex: 0.7,
        color: 'white'
    },
    viewProfileButton: {
        borderWidth: 1,
        borderColor: colors.primary,
        height: '100%',
        margin: 0,
        marginRight: 5
    },
    profilePhoto: {
        height: 60,
        width: 60,
        borderRadius: 30,
        flex: 0.2
    },
    messageButton: {
        height: '100%',
        margin: 0,
        marginLeft: 5
    }
})

// styling for the Map
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
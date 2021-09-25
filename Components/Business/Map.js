import React, {useState} from 'react';
import MapView, {PROVIDER_GOOGLE} from "react-native-maps";
import {getRouteInformation, UpdatedRoutes} from "../API/RouteAPI";
import MapViewDirections from "react-native-maps-directions";
import {StyleSheet} from "react-native";
import {colors} from "../../Styles/GlobalStyles"
import {GoogleAPIKey} from "../API/APIConstants";
import {HelpDialog} from "./HelpDialog";
import {ProfileSnapshot} from "../API/ProfileAPI";


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
            key={r.id + "route"}
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
    const [profileData, setProfileData] = useState(null)
    ProfileSnapshot(setProfileData, memberData?.ID)

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
                        memberData={memberData}
                        profileData={profileData}/>
        </>
    )
}


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
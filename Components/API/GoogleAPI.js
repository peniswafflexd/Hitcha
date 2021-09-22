import React, {useEffect} from 'react';
import Geocoder from "react-native-geocoding";
import {GoogleAPIKey} from "./APIConstants";

export const getAddressFromCoordinates = (location, setRouteLocations, routeLocations) => {
    if(!Geocoder.isInit) Geocoder.init(GoogleAPIKey, {language: "en"})
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
}
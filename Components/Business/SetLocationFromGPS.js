import {getAddressFromCoordinates} from "../API/GoogleAPI";
import ModalLoader from "../Presentation/ModalLoader";
import React from "react";

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
export const SetLocationFromGPS = ({location, setRouteLocations, routeLocations, isLoading}) => {
    if (!isLoading) getAddressFromCoordinates(location, setRouteLocations, routeLocations);
    return <ModalLoader isLoading={isLoading}/>
}
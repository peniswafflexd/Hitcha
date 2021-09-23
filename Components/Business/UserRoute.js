import {StyleSheet, Text, View} from "react-native";
import CustomButton from "../Presentation/CustomButton";
import {colors} from "../../Styles/GlobalStyles";
import {deleteRoute, getUserRoute} from "../API/RouteAPI";
import React from "react";

/**
 * user route information plus buttons to edit and finish the route
 * @param userRoute - user route information
 * @param setUserRoute - function to set the state of user route
 * @param navigation - navigation component
 * @returns {JSX.Element}
 * @constructor
 */
export const UserRoute = ({userRoute, setUserRoute, navigation}) => {
    getUserRoute(setUserRoute) // doesn't return anything so not worried about the .then()
    if (!userRoute) return null;
    return (
        <View style={styles.userRouteView}>
            <Text style={styles.userRouteTitle}>Your current route: </Text>
            <Text style={styles.userRouteDetails}>Start:
                <Text style={styles.userRouteAccent}> {userRoute.StartName}</Text>
            </Text>
            <Text style={styles.userRouteDetails}>End:
                <Text style={styles.userRouteAccent}> {userRoute.EndName}</Text>
            </Text>

            <View style={{flexDirection: 'row'}}>
                <CustomButton flex={0.5}
                              color={"transparent"}
                              text={"Edit"}
                              buttonStyle={{borderWidth: 1, borderColor: 'white',}}
                              onPress={() => navigation.navigate("PostRoute")}
                />
                <CustomButton flex={0.5}
                              color={colors.primary}
                              text={"Finish"}
                              onPress={() => {
                                  deleteRoute()
                                  setUserRoute(null)
                              }}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    userRouteView: {
        width: '95%',
        backgroundColor: colors.mediumBlack,
        margin: 20,
        borderRadius: 10,
        flex: 0.25,
        padding: 10
    },
    userRouteTitle: {
        fontSize: 20,
        color: colors.lightText
    },
    userRouteDetails: {
        fontSize: 17,
        color: colors.lightText
    },
    userRouteAccent: {
        fontSize: 17,
        color: colors.primary
    },
})
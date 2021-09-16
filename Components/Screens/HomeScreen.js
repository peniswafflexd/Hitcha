import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {createStackNavigator} from "@react-navigation/stack";
import PostRouteScreen from "./PostRouteScreen";
import Header from "../Header"
import {deleteRoute, getUserRoute} from "../API/RouteAPI";
import CustomButton from "../CustomButton";
import {colors} from "../../Styles/GlobalStyles";
import {ImageButton} from "../ImageButton";


const Stack = createStackNavigator();

/**
 * Navigator to navigate to and from the
 * post route screen and the home screen
 * @returns {JSX.Element}
 * @constructor
 */
function HomeScreen() {
    return <Stack.Navigator initalRouteName={"Home"} headerMode={false}>
        <Stack.Screen name={"Home"} component={Content}/>
        <Stack.Screen name={"PostRoute"} component={PostRouteScreen}/>
    </Stack.Navigator>
}

/**
 * The main content of the home screen, including the header, buttons and route info.
 * if the user has a route, will display it on the home screen, otherwise won't display
 * anything where it should be
 * @param navigation
 * @returns {JSX.Element}
 * @constructor
 */
function Content({navigation}) {
    const [userRoute, setUserRoute] = useState(undefined);
    getUserRoute(setUserRoute) // doesn't return anything so not worried about the .then()
    return (
        <SafeAreaView style={style.safeArea}>
            <Header title={"Home"}/>
            <View style={{flex: 0.25, flexDirection: 'row'}}>
                <ImageButton image={require("../../assets/images/steeringwheel.jpg")}
                             title={"Driving Somewhere"}
                             onPress={() => navigation.navigate("PostRoute")}/>
                <ImageButton image={require("../../assets/images/backpacking.jpg")} title={"Hitching Somewhere"}/>
            </View>
            {userRoute ? <UserRoute userRoute={userRoute} setUserRoute={setUserRoute}/> : null}
        </SafeAreaView>
    );
}

/**
 * user route information plus buttons to edit and finish the route
 * @param userRoute - user route information
 * @param setUserRoute - function to set the state of user route
 * @returns {JSX.Element}
 * @constructor
 */
const UserRoute = ({userRoute, setUserRoute}) => {
    return (
        <View style={style.userRouteView}>
            <Text style={style.userRouteTitle}>Your current route: </Text>
            <Text style={style.userRouteDetails}>Start:
                <Text style={style.userRouteAccent}> {userRoute.StartName}</Text>
            </Text>
            <Text style={style.userRouteDetails}>End:
                <Text style={style.userRouteAccent}> {userRoute.EndName}</Text>
            </Text>

            <View style={{flexDirection: 'row'}}>
                <CustomButton flex={0.5} color={"transparent"} text={"Edit"}
                              buttonStyle={{borderWidth: 1, borderColor: 'white',}}/>
                <CustomButton flex={0.5} color={colors.primary} text={"Finish"}
                              onPress={() => {
                                  deleteRoute()
                                  setUserRoute(null)
                              }}/>
            </View>
        </View>
    )
}

export default HomeScreen;

const style = StyleSheet.create({
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
    safeArea: {
        backgroundColor: colors.darkBlack,
        height: '100%',
        flexDirection: 'column',
        alignItems: 'center',
    }
})
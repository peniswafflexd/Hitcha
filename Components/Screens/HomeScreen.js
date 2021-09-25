import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {createStackNavigator} from "@react-navigation/stack";
import PostRouteScreen from "./PostRouteScreen";
import Header from "../Presentation/Header"
import {colors} from "../../Styles/GlobalStyles";
import {ImageButton} from "../Presentation/ImageButton";
import {UserRoute} from "../Presentation/UserRoute";
import {deleteRoute, getUserRoute} from "../API/RouteAPI";

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
    const finishOnPress = () => {
        deleteRoute()
        setUserRoute(null)
    }
    return (
        <SafeAreaView style={style.safeArea}>
            <Header title={"Home"}/>
            <View style={{flex: 0.28, flexDirection: 'row'}}>
                <ImageButton image={require("../../assets/images/steeringwheel-small.jpg")}
                             title={"Driving Somewhere"}
                             onPress={() => navigation.navigate("PostRoute")}
                />
                <ImageButton image={require("../../assets/images/backpacking-small.jpeg")}
                             title={"Hitching Somewhere"}
                             onPress={() => navigation.navigate("Map")}
                />
            </View>
            <UserRoute userRoute={userRoute} finishOnPress={finishOnPress} navigation={navigation}/>
        </SafeAreaView>
    );
}

export default HomeScreen;

const style = StyleSheet.create({
    safeArea: {
        backgroundColor: colors.darkBlack,
        height: '100%',
        flexDirection: 'column',
        alignItems: 'center',
    }
})
import React, {useState} from 'react'
import {createStackNavigator} from "@react-navigation/stack";
import SignUpScreen from "./Screens/SignUpScreen";
import SignInScreen from "./Screens/SignInScreen";

const Stack = createStackNavigator();

/**
 * just a navigation component to switch between the login and signup screens.
 * @returns {JSX.Element}
 * @constructor
 */
const SignInNavigation = () => {
    return (
    <Stack.Navigator headerMode={false} initialRouteName={"Sign In"}>
        <Stack.Screen name={"Sign Up"} component={SignUpScreen} />
        <Stack.Screen name={"Sign In"} component={SignInScreen} />
    </Stack.Navigator>
    )
}

export default SignInNavigation;
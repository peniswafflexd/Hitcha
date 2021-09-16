import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import HomeScreen from "./Screens/HomeScreen";
import MapScreen from "./Screens/MapScreen";
import ProfileScreen from "./Screens/ProfileScreen";
import {Image, View} from "react-native";
import {colors} from "../Styles/GlobalStyles"

const Tab = createBottomTabNavigator();

const TabBar = () => {
    return (
        <Tab.Navigator initialRouteName={"Home"}
                       tabBarOptions={{
                           showLabel: false,
                           style: {
                               position: 'absolute',
                               backgroundColor: '#161616',
                           }
                       }}>
            <Tab.Screen name={"Home"} component={HomeScreen} options={{
                tabBarIcon: ({focused}) => (
                    <TabBarIcon icon={require('../assets/icons/home.png')} focused={focused}/>
                )
            }}/>
            <Tab.Screen name={"Map"} component={MapScreen} options={{
                tabBarIcon: ({focused}) => (
                    <TabBarIcon icon={require('../assets/icons/map.png')} focused={focused}/>
                )
            }}/>
            <Tab.Screen name={"Profile"} component={ProfileScreen} options={{
                tabBarIcon: ({focused}) => (
                    <TabBarIcon icon={require('../assets/icons/profile.png')} focused={focused}/>
                )
            }}/>
        </Tab.Navigator>
    );
}

const TabBarIcon = ({icon, focused}) => {
    return (
        <View style={{alignItems: "center", justifyContent: "center", top: 5}}>
            <Image
                source={icon}
                resizeMode={"contain"}
                style={{
                    width: 32,
                    height: 32,
                    tintColor: focused ? colors.primary : "#FFFFFF"
                }}
            />
        </View>

    )
}

export default TabBar;
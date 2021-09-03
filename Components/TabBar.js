import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import HomeScreen from "./Screens/HomeScreen";
import MapScreen from "./Screens/MapScreen";
import ProfileScreen from "./Screens/ProfileScreen";
import {Image, Text, View} from "react-native";
import MessageIcon from "./MessageIcon";

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
                    <View style={{alignItems: "center", justifyContent: "center", top: 5}}>
                        <Image
                            source={require('../assets/icons/home.png')}
                            resizeMode={"contain"}
                            style={{
                                width: 32,
                                height: 32,
                                tintColor: focused ? '#FDAF01' : "#FFFFFF"
                            }}
                        />
                    </View>
                )
            }}/>
            <Tab.Screen name={"Map"} component={MapScreen} options={{
                tabBarIcon: ({focused}) => (
                    <View style={{alignItems: "center", justifyContent: "center", top: 5}}>
                        <Image
                            source={require('../assets/icons/map.png')}
                            resizeMode={"contain"}
                            style={{
                                width: 32,
                                height: 32,
                                tintColor: focused ? '#FDAF01' : "#FFFFFF"
                            }}
                        />
                    </View>
                )
            }}/>
            <Tab.Screen name={"Profile"} component={ProfileScreen} options={{
                tabBarIcon: ({focused}) => (
                    <View style={{alignItems: "center", justifyContent: "center", top: 5}}>
                        <Image
                            source={require('../assets/icons/profile.png')}
                            resizeMode={"contain"}
                            style={{
                                width: 32,
                                height: 32,
                                tintColor: focused ? '#FDAF01' : "#FFFFFF"
                            }}
                        />
                    </View>
                )
            }}/>
        </Tab.Navigator>
    );
}

export default TabBar;
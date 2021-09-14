import React, {useState} from 'react';
import {ImageBackground, Pressable, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {createStackNavigator} from "@react-navigation/stack";
import PostRouteScreen from "./PostRouteScreen";
import Header from "../Header"
import {deleteRoute, getUserRoute} from "../API/RouteAPI";
import CustomButton from "../CustomButton";
import {globalStyles} from "../../Styles/GlobalStyles";

const ImageButton = ({image, title, onPress}) => {
    return <View style={{flex: 1, margin: 10, zIndex: 0}}>
        <Pressable onPress={onPress}>
            <ImageBackground
                source={image}
                style={{
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 15,
                    overflow: 'hidden',
                    zIndex: 0
                }}
            >
                <View style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    opacity: 0.4,
                    backgroundColor: 'black',
                    height: '100%',
                    width: '100%',
                    zIndex: 0
                }}/>
                <Text style={globalStyles.screenTitle}>{title}</Text>
            </ImageBackground>
        </Pressable>
    </View>
}

const Stack = createStackNavigator();


function HomeScreen() {
    return <Stack.Navigator initalRouteName={"Home"} headerMode={false}>
        <Stack.Screen name={"Home"} component={Content}/>
        <Stack.Screen name={"PostRoute"} component={PostRouteScreen}/>
    </Stack.Navigator>
}

function Content({navigation}) {
    const [userRoute, setUserRoute] = useState(undefined);
    getUserRoute(setUserRoute)
    return (
        <SafeAreaView
            style={{backgroundColor: '#191919', height: '100%', flexDirection: 'column', alignItems: 'center',}}>
            <Header title={"Home"}/>
            <View style={{flex: 0.25, flexDirection: 'row'}}>
                <ImageButton image={require("../../assets/images/steeringwheel.jpg")} title={"Driving Somewhere"}
                             onPress={() => navigation.navigate("PostRoute")}/>
                <ImageButton image={require("../../assets/images/backpacking.jpg")} title={"Hitching Somewhere"}/>
            </View>
            {userRoute ? <UserRoute userRoute={userRoute} setUserRoute={setUserRoute}/> : null}
        </SafeAreaView>
    );
}

const UserRoute = ({userRoute, setUserRoute}) => {
    return (
        <View style={{
            width: '95%',
            backgroundColor: '#252525',
            margin: 20,
            borderRadius: 10,
            flex: 0.3,
            padding: 10
        }}>
            <Text style={{fontSize: 20, color: 'white',}}>Your current route: </Text>
            <Text style={{fontSize: 17, color: 'white',}}>Start:<Text
                style={{fontSize: 17, color: '#FDAF01', padding: 30}}> {userRoute.StartName}</Text></Text>
            <Text style={{fontSize: 17, color: 'white',}}>End:<Text
                style={{fontSize: 17, color: '#FDAF01',}}> {userRoute.EndName}</Text></Text>
            <View style={{flexDirection: 'row'}}>
                <CustomButton flex={0.5} color={"transparent"} text={"Edit"}
                              buttonStyle={{
                                  borderWidth: 1,
                                  borderColor: 'white',
                              }}/>
                <CustomButton flex={0.5} color={'#FDAF01'} text={"Finish"} onPress={() => {
                    deleteRoute()
                    setUserRoute(null)
                }}/>
            </View>
        </View>
    )
}

// <ImageButton
//     title={"Hitching Somewhere"}
//     onPress={() => alert("Hitching Somewhere")}
//     image={require("../../assets/images/backpacking.jpg")}
//     style={{flex: 1}}
// />
export default HomeScreen;

const style = StyleSheet.create({
    ImageButton: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        overflow: 'hidden',
        zIndex: 0
    },
    ImageButtonOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        opacity: 0.4,
        backgroundColor: 'black',
        height: '100%',
        width: '100%',
        zIndex: 0
    },
    userRouteView: {
        width: '95%',
        // backgroundColor: globalStyles.colors.mediumBlack,
        margin: 20,
        borderRadius: 10,
        flex: 0.3,
        padding: 10
    },
    userRouteTitle:{
        fontSize: 20,
        // fontColor: globalStyles.colors.lightText
    },
    userRouteDetails: {
        fontSize: 17,
        // color: globalStyles.colors.lightText
    },

})
import React, {useState} from 'react';
import {ImageBackground, Pressable, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {createStackNavigator} from "@react-navigation/stack";
import PostRouteScreen from "./PostRouteScreen";
import Header from "../Header"
import {deleteRoute, getUserRoute} from "../API/RouteAPI";
import CustomButton from "../CustomButton";
import {colors, globalStyles} from "../../Styles/GlobalStyles";

// A button with an image for a background.
const ImageButton = ({image, title, onPress}) => {
    return <View style={{flex: 1, margin: 10, zIndex: 0}}>
        <Pressable onPress={onPress}>
            <ImageBackground source={image} style={style.ImageButton}>
                <View style={style.ImageButtonOverlay}/>
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
    getUserRoute(setUserRoute) // doesn't return anything so not worried about the .then()
    return (
        <SafeAreaView style={style.safeArea}>
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
                              buttonStyle={{
                                  borderWidth: 1,
                                  borderColor: 'white',
                              }}/>
                <CustomButton flex={0.5} color={'#FDAF01'} text={"Finish"}
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
        backgroundColor: '#191919',
        height: '100%',
        flexDirection: 'column',
        alignItems: 'center',
    }
})
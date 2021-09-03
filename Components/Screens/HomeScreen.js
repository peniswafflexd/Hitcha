import React from 'react';
import {ImageBackground, Pressable, SafeAreaView, Text, View} from 'react-native';
import {createStackNavigator} from "@react-navigation/stack";
import PostRouteScreen from "./PostRouteScreen";
import Header from "../Header"

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
                <Text style={{color: 'white', fontSize: 28, fontWeight: 'bold', textAlign: 'center'}}>{title}</Text>
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
    return (
        <SafeAreaView style={{backgroundColor: '#191919', height: '100%', flexDirection: 'column'}}>
            <Header title={"Home"}/>
            <View style={{flex: 0.25, flexDirection: 'row'}}>
                <ImageButton image={require("../../assets/images/steeringwheel.jpg")} title={"Driving Somewhere"}
                             onPress={() => navigation.navigate("PostRoute")}/>
                <ImageButton image={require("../../assets/images/backpacking.jpg")} title={"Hitching Somewhere"}/>
            </View>
        </SafeAreaView>
    );
}

// <ImageButton
//     title={"Hitching Somewhere"}
//     onPress={() => alert("Hitching Somewhere")}
//     image={require("../../assets/images/backpacking.jpg")}
//     style={{flex: 1}}
// />
export default HomeScreen;
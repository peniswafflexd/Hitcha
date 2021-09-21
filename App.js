import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import TabBar from "./Components/TabBar";
import {authChanged} from "./Components/API/RouteAPI";
import SignInNavigation from "./Components/SignInNavigation";
import {auth} from "./Components/API/APIConstants";

export let setUser = null;

export default function App() {
    let appContent = {}
    const [userAuth, setUserAuth] = useState(auth.currentUser);
    setUser = setUserAuth;
    if(userAuth) appContent = <TabBar/>
    else appContent = <SignInNavigation/>

  return (
      <NavigationContainer>
          {appContent}
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

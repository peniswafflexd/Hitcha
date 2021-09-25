import React, {useState} from 'react';
import { NavigationContainer } from "@react-navigation/native";
import TabBar from "./Components/Presentation/TabBar";
import SignInNavigation from "./Components/Presentation/SignInNavigation";
import {auth} from "./Components/API/APIConstants";
import {authChanged} from "./Components/API/AuthenticationAPI";


export default function App() {
    const [userAuth, setUserAuth] = useState(auth.currentUser);
    authChanged(setUserAuth);
    let appContent = (userAuth) ? <TabBar/> : <SignInNavigation/>
    return (
        <NavigationContainer>
            {appContent}
        </NavigationContainer>
    );
}


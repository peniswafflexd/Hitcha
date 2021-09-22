import React, {useState} from 'react';
import { NavigationContainer } from "@react-navigation/native";
import TabBar from "./Components/TabBar";
import SignInNavigation from "./Components/SignInNavigation";
import {auth} from "./Components/API/APIConstants";
import {authChanged} from "./Components/API/AuthenticationAPI";

// export let setUser = null;

// export default function App() {
//     const [userAuth, setUserAuth] = useState(auth.currentUser);
//     setUser = setUserAuth;
//     let appContent = (userAuth) ? <TabBar/> : <SignInNavigation/>
//
//   return (
//       <NavigationContainer>
//           {appContent}
//       </NavigationContainer>
//   );
// }

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


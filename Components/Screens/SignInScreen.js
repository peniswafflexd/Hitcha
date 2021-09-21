import React, {useState} from 'react';
import Modal from 'react-native-modal';
import {Pressable, Text, TextInput, View, StyleSheet} from "react-native";
import Header from "../Header";
import CustomButton from "../CustomButton";
import {colors} from "../../Styles/GlobalStyles";
import {signInFirebase} from "../API/AuthenticationAPI";

/**
 * the screen for signing into the application
 * @param route - TODO: see if this is still needed.
 * @param navigation
 * @returns {JSX.Element}
 * @constructor
 */
const SignInScreen = ({route, navigation}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isVisible, setIsVisible] = useState(true);

    return  (
        <View style={styles.background}>
            <Header title={"Sign In"} messageIcon={false}/>
            <Modal onModalHide={()=>navigation.replace("Sign Up")} isVisible={isVisible} style={{alignItems: 'center'}} hasBackdrop={false}>
                <View style={styles.modal}>
                    <Text style={{top: 0, left: 0, color: colors.lightText, margin: 25}}>Sign In to your Account:</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={setEmail}
                        placeholderTextColor={colors.lightText}
                        placeholder="Email Address"
                    />
                    <TextInput
                        style={styles.input}
                        onChangeText={setPassword}
                        secureTextEntry={true}
                        placeholderTextColor={colors.lightText}
                        placeholder="Password"
                    />
                    <CustomButton flex={1}
                                  buttonStyle={{marginLeft: 50, marginRight: 50, marginTop: 30}}
                                  color={colors.primary}
                                  text={"Sign in"}
                                  onPress={() => {
                                      console.log("signing in")
                                      signInFirebase(email, password)
                                  }}/>
                    <Pressable hitSlop={5} onPress={() => {setIsVisible(false)}}>
                        <Text style={styles.link}>
                            Don't have an account?
                            <Text style={{color: colors.primary}}> Sign Up</Text>
                        </Text>
                    </Pressable>
                </View>
            </Modal>
        </View>
    )
}

export default SignInScreen;

const styles = StyleSheet.create({
    modal: {
        height: '60%',
        width: '100%',
        backgroundColor: colors.mediumBlack,
        borderRadius: 20,
        flexDirection: 'column',
        borderWidth: 0.5,
        borderColor: '#4D4B4B'
    },
    input: {
        backgroundColor: "#191919",
        color: colors.lightText,
        width: '82%',
        height: 40,
        marginLeft: 30,
        marginRight: 30,
        marginBottom: 30,
        borderRadius: 6,
        padding: 5,
        borderBottomWidth: 1,
        borderColor: colors.lightText
    },
    background: {
        flexDirection: "column",
        height: '100%',
        width: '100%',
        backgroundColor: "#191919"
    },
    link: {
        color: "white",
        fontSize: 14,
        marginTop: 0,
        alignSelf: 'center',
        marginBottom: 15
    },

})
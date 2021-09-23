import React, {useState} from 'react';
import Modal from 'react-native-modal';
import {Pressable, StyleSheet, Text, TextInput, View} from "react-native";
import Header from "../Header";
import CustomButton from "../CustomButton";
import {colors} from "../../Styles/GlobalStyles"
import {signUpFirebase} from "../API/AuthenticationAPI";

/**
 * The screen for making an account with the application.
 * @param navigation
 * @returns {JSX.Element}
 * @constructor
 */
const SignUpScreen = ({navigation}) => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isVisible, setIsVisible] = useState(true);

    return (
        <View style={{flexDirection: "column", height: '100%', width: '100%', backgroundColor: "#191919"}}>
            <Header title={"Sign Up"} messageIcon={false}/>
            <Modal onModalHide={() => navigation.replace("Sign In")} isVisible={isVisible}
                   style={{alignItems: 'center'}} hasBackdrop={false}>
                <View style={styles.modal}>
                    <Text style={{top: 0, left: 0, color: colors.lightText, margin: 25}}>Make an Account:</Text>
                    <TextInput
                        style={[styles.input, {marginBottom: 30}]}
                        onChangeText={setUsername}
                        placeholderTextColor={colors.lightText}
                        placeholder="First & Last Name"
                    />
                    <TextInput
                        style={[styles.input, {marginBottom: 30}]}
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
                                  text={"Sign Up"}
                                  onPress={() => {
                                      signUpFirebase(username, email, password)
                                  }}/>
                    <Pressable hitSlop={5} onPress={() => {
                        setIsVisible(false)
                    }}>
                        <Text style={styles.link}>
                            Already have an account?
                            <Text style={{color: colors.primary}}> Sign In</Text>
                        </Text>
                    </Pressable>
                </View>
            </Modal>
        </View>
    )
}

export default SignUpScreen;

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
        borderRadius: 6,
        padding: 5,
        borderBottomWidth: 1,
        borderColor: colors.lightText,
    },
    link: {
        color: "white",
        fontSize: 14,
        marginTop: 0,
        alignSelf: 'center',
        marginBottom: 15
    }
})
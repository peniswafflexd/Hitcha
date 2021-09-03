import React, {useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import {Pressable, Text, TextInput, View, Modal as Modal1} from "react-native";
import Header from "../Header";
import CustomButton from "../CustomButton";
import {signUpFirebase} from "../API/RouteAPI";
import {useFocusEffect, useIsFocused} from "@react-navigation/native";

const SignUpScreen = ({route, navigation}) => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isVisible, setIsVisible] = useState(true);

    return (
        <View style={{flexDirection: "column", height: '100%', width: '100%', backgroundColor: "#191919"}}>
            <Header title={"Sign Up"} messageIcon={false}/>
            <Modal onModalHide={() => navigation.replace("Sign In")} isVisible={isVisible} style={{alignItems: 'center'}} hasBackdrop={false}>
                <View style={{
                    height: '60%',
                    width: '100%',
                    backgroundColor: '#252525',
                    borderRadius: 20,
                    flexDirection: 'column',
                    borderWidth: 0.5,
                    borderColor: '#4D4B4B'
                }}>
                    <Text style={{top: 0, left: 0, color: '#C1C1C1', margin: 25}}>Make an Account:</Text>
                    <TextInput
                        style={{
                            backgroundColor: "#191919",
                            color: '#C1C1C1',
                            width: '82%',
                            height: 40,
                            marginLeft: 30,
                            marginRight: 30,
                            marginBottom: 30,
                            borderRadius: 6,
                            padding: 5,
                            borderBottomWidth: 1,
                            borderColor: '#C1C1C1',
                        }}
                        onChangeText={setUsername}
                        placeholderTextColor={"#C1C1C1"}
                        placeholder="First & Last Name"
                    />
                    <TextInput
                        style={{
                            backgroundColor: "#191919",
                            color: '#C1C1C1',
                            width: '82%',
                            height: 40,
                            marginLeft: 30,
                            marginRight: 30,
                            marginBottom: 30,
                            borderRadius: 6,
                            padding: 5,
                            borderBottomWidth: 1,
                            borderColor: '#C1C1C1'
                        }}
                        onChangeText={setEmail}
                        placeholderTextColor={"#C1C1C1"}
                        placeholder="Email Address"
                    />
                    <TextInput
                        style={{
                            backgroundColor: "#191919",
                            color: '#C1C1C1',
                            width: '82%',
                            height: 40,
                            marginLeft: 30,
                            marginRight: 30,
                            borderRadius: 6,
                            padding: 5,
                            borderBottomWidth: 1,
                            borderColor: '#C1C1C1'
                        }}
                        onChangeText={setPassword}
                        secureTextEntry={true}
                        placeholderTextColor={"#C1C1C1"}
                        placeholder="Password"
                    />
                    <CustomButton flex={1}
                                  buttonStyle={{marginLeft: 50, marginRight: 50, marginTop: 30}}
                                  color={'#FDAF01'}
                                  text={"Sign Up"}
                                  onPress={() => {
                                      signUpFirebase(username, email, password)
                                  }}/>
                        <Pressable hitSlop={5} onPress={() => {
                            setIsVisible(false)
                        }}>
                            <Text style={{color: "white", fontSize: 14, marginTop: 0, alignSelf: 'center', marginBottom: 15}}>
                                Already have an account?
                                <Text style={{color: '#FDAF01'}}> Sign In</Text>
                            </Text>
                        </Pressable>
                </View>
            </Modal>
        </View>
    )
}

export default SignUpScreen;
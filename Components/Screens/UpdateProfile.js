import React, {useState} from 'react';
import {Keyboard, SafeAreaView, StyleSheet, Text, TextInput, View} from 'react-native';
import Header from "../Presentation/Header";
import CustomButton from "../Presentation/CustomButton";
import {colors} from "../../Styles/GlobalStyles"
import ModalLoader from "../Presentation/ModalLoader";
import {updateUserProfile} from "../API/ProfileAPI";
import {ChangeImage} from "../API/NativeAPI";


/**
 * screen for updating profile information such as, photos and bio
 * @param route - parameters passed from another screen through navigation.
 * @param navigation
 * @returns {JSX.Element}
 * @constructor
 */
function UpdateProfile({route, navigation}) {
    const [bio, setBio] = useState(route.params.bio);
    const [isLoading, setIsLoading] = useState(false);
    return (
        <SafeAreaView style={{backgroundColor: colors.darkBlack, height: '100%'}}>
            <Header title={"Update Profile"}/>
            <View style={{flex: 0.85, flexDirection: 'column', padding: 20}}>
                <Text style={{color: 'white'}}>Update your bio: </Text>
                <UselessTextInput
                    multiline
                    numberOfLines={4}
                    onChangeText={text => setBio(text)}
                    value={bio}
                    style={styles.multilineInput}
                />
                <CustomButton flex={0.2} text={"Update"}
                              onPress={() => {
                                  Keyboard.dismiss();
                                  updateUserProfile({"profile.bio": bio}).then(() => setIsLoading(false))
                                  setIsLoading(true)
                              }}
                              buttonStyle={styles.buttonStyle}/>
                <CustomButton flex={0.2}
                              text={"Change Cover Photo"}
                              onPress={() => {
                                  ChangeImage("covers", setIsLoading)
                                  setIsLoading(true)
                              }}
                              buttonStyle={styles.buttonStyle}/>
                <CustomButton flex={0.2}
                              text={"Change Profile Photo"}
                              onPress={() => {
                                  ChangeImage("avatars", setIsLoading)
                                  setIsLoading(true)
                              }}
                              buttonStyle={styles.buttonStyle}/>

                <View style={{flex: 0.2, flexDirection: 'row', marginBottom: 0}}>
                    <CustomButton text={"Cancel"}
                                  onPress={() => navigation.navigate("Profile")}
                                  buttonStyle={{borderWidth: 2, height: 50, marginBottom: 10}}/>
                    <CustomButton text={"Continue"}
                                  onPress={() => navigation.navigate("Profile")}
                                  textStyle={{color: colors.primary}}
                                  buttonStyle={{
                                      borderWidth: 2,
                                      borderColor: colors.primary,
                                      height: 50,
                                      marginBottom: 10
                                  }}/>
                </View>
            </View>
            <ModalLoader isLoading={isLoading}/>
        </SafeAreaView>
    );
}

/**
 * for multiline input
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const UselessTextInput = (props) => {
    return (
        <TextInput
            {...props} // Inherit any props passed to it; e.g., multiline, numberOfLines below
            editable
            maxLength={255}
        />
    );
}

export default UpdateProfile;

const styles = StyleSheet.create({
    multilineInput: {
        padding: 10,
        backgroundColor: '#4D4B4B',
        color: colors.lightText,
        flex: 0.2,
        borderRadius: 15,
        marginTop: 5
    },
    buttonStyle: {
        borderWidth: 2,
        borderColor: 'white',
        height: 50
    }
})
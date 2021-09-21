import React, {useState} from 'react';
import {Keyboard, SafeAreaView, StyleSheet, Text, TextInput, View} from 'react-native';
import Header from "../Header";
import CustomButton from "../CustomButton";
import * as ImagePicker from 'expo-image-picker'
import {colors} from "../../Styles/GlobalStyles"
import ModalLoader from "../ModalLoader";
import {updateUserProfile, uploadImage} from "../API/ProfileAPI";


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
                                  updateUserProfile({"profile.bio": bio}).then(()=>setIsLoading(false)) //doesn't return anything so not .then()
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

/**
 * gets user image and uploads it to firebase
 * @param folder - the folder the image file to change is in
 * @param setIsLoading - state setter for loading screens.
 * @constructor
 */
const ChangeImage = (folder, setIsLoading) => {
    SelectImage().then((uri) => {
        UploadImage(uri, folder).then(() => {
            setIsLoading(false)
            alert("Photo Changed!")
            console.log("Photo Changed!")
        }).catch(error => {
            setIsLoading(false)
            alert(error.message)
        });
    });
}

/**
 * allows a user to pick an image from their gallery
 * @returns {Promise<*>}
 * @constructor
 */
const SelectImage = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
        alert('Permission to access camera roll is required!');
        return;
    }
    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (pickerResult.cancelled === true) {
        return;
    }
    return pickerResult.uri
}

/**
 * uploads the image to firebase
 * @param uri - location of photo
 * @param filename - name of the photo
 * @returns {Promise<void>}
 * @constructor
 */
const UploadImage = async (uri, filename) => {
    const blob: Blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            resolve(xhr.response);
        };
        xhr.onerror = function () {
            reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
    }).catch(error => console.log(error.message));

    await uploadImage(filename, blob);
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
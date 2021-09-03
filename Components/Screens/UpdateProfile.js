import React, {useState} from 'react';
import {Alert, SafeAreaView, Text, TextInput, View, Keyboard} from 'react-native';
import Header from "../Header";
import CustomButton from "../CustomButton";
import * as ImagePicker from 'expo-image-picker'
import {updateUserProfile, uploadImage} from "../API/RouteAPI";

const UselessTextInput = (props) => {
    return (
        <TextInput
            {...props} // Inherit any props passed to it; e.g., multiline, numberOfLines below
            editable
            maxLength={255}
        />
    );
}

function UpdateProfile({route, navigation}) {
    const [bio, setBio] = useState(route.params.bio);
    return (
        <SafeAreaView style={{backgroundColor: '#191919', height: '100%'}}>
            <Header title={"Update Profile"}/>
            <View style={{flex: 0.85, flexDirection: 'column', padding: 20}}>
                <Text style={{color: 'white'}}>Update your bio: </Text>
                <UselessTextInput
                    multiline
                    numberOfLines={4}
                    onChangeText={text => setBio(text)}
                    value={bio}
                    style={{padding: 10, backgroundColor: '#4D4B4B', color: "#C1C1C1", flex: 0.2, borderRadius: 15, marginTop: 5}}
                />
                <CustomButton flex={0.2} text={"Update"} onPress={() => {
                    Keyboard.dismiss();
                    updateUserProfile({"profile.bio": bio})
                }}
                              buttonStyle={{borderWidth: "2" , borderColor: 'white', height: 50}}/>
                <CustomButton flex={0.2} text={"Change Cover Photo"} onPress={() => ChangeImage("covers")}
                              buttonStyle={{borderWidth: "2" , borderColor: 'white', height: 50, marginBottom: 10}}/>
                <CustomButton flex={0.2} text={"Change Profile Photo"} onPress={() => ChangeImage("avatars")}
                              buttonStyle={{borderWidth: "2", borderColor: 'white', height: 50, marginBottom: 10}}/>
                <View style={{flexDirection: 'row'}}>
                    <CustomButton text={"Cancel"} onPress={() => navigation.navigate("Profile")}
                                  buttonStyle={{borderWidth: "2", height: 50, marginBottom: 10}}/>
                    <CustomButton text={"Continue"} onPress={() => navigation.navigate("Profile")}
                                  textStyle={{color: '#FDAF01'}}
                                  buttonStyle={{
                                      borderWidth: "2",
                                      borderColor: '#FDAF01',
                                      height: 50,
                                      marginBottom: 10
                                  }}/>
                </View>
            </View>
        </SafeAreaView>
    );
}

const ChangeImage = (folder) => {
    SelectImage().then((uri) => {
        UploadImage(uri, folder).then(() => {
            Alert.alert(
                'Photo uploaded!',
                'Your photo has been uploaded to Firebase Cloud Storage!'
            );
        }).catch(error => console.log(error.message));
    });
}

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
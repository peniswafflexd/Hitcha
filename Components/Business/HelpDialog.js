import React, {useState} from "react";
import {ProfileSnapshot} from "../API/ProfileAPI";
import {Image, Pressable, StyleSheet, Text, View} from "react-native";
import CustomFastImage from "../Presentation/CustomFastImage";
import {colors} from "../../Styles/GlobalStyles";
import CustomButton from "../Presentation/CustomButton";
import {MessageModal} from "../Presentation/MessageModal";
import ProfileModal from "../Presentation/ProfileModal";

/**
 * will display a small modal with help text if no route selected.
 * Will display route information if route is selected.
 * @param routeDisplay - bool, whether or not a route is selected
 * @param routeInformation - data for the selected route
 * @param props - props to send to routeInformationContent component (memberData, etc)
 * @returns {JSX.Element}
 * @constructor
 */
export const HelpDialog = ({routeDisplay, routeInformation, ...props}) => {
    return (
        <View style={[styles.helpModal, {width: routeDisplay ? "95%" : '60%', height: routeDisplay ? "50%" : "15%",}]}>
            {routeDisplay ? <RouteInformationContent routeInformation={routeInformation} {...props}/> :
                <Text style={{fontSize: 16, color: colors.primary}}>Tap a route for more information</Text>}
        </View>
    )
}
/**
 * Content for the helpDialog when a route is selected, displaying
 * route information, destination, route owner and buttons to contact
 * the route owner
 * @param routeInformation - selected route data
 * @param setRouteDisplay - function to switch if route is selected
 * @param memberData - data for member who owns the route.
 * @returns {JSX.Element}
 * @constructor
 */
const RouteInformationContent = ({routeInformation, setRouteDisplay, memberData, profileData}) => {
    const [MessageScreen, setMessageScreen] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    // const [profileData, setProfileData] = useState(null)
    // ProfileSnapshot(setProfileData, memberData.ID)

    return (
        <View style={{flexDirection: 'column', width: "100%", height: '100%'}}>

            <View style={{flex: 0.25, flexDirection: 'row', alignItems: 'center'}}>
                <CustomFastImage style={styles.profilePhoto} source={{uri: routeInformation.Photo}}/>
                <Text style={styles.routeOwnerText}>{routeInformation.Name}</Text>
                <Pressable style={{flex: 0.1, alignSelf: 'flex-start'}} onPress={() => setRouteDisplay(false)}>
                    <Image source={require('../../assets/icons/close.png')}
                           resizeMode={"contain"}
                           style={styles.closeIcon}/>
                </Pressable>
            </View>

            <View style={{flex: 0.5, flexDirection: 'column', justifyContent: 'space-around'}}>
                <Text style={{color: colors.primary}}>Destination:
                    <Text style={{color: 'white'}}>{"         " + routeInformation.EndName}</Text>
                </Text>
                <Text style={{color: colors.primary}}>Start Location:
                    <Text style={{color: 'white'}}>{"     " + routeInformation.StartName}</Text>
                </Text>
                <Text style={{color: colors.primary, marginBottom: 30}}>Seats:
                    <Text style={{color: 'white'}}>{"                    " + routeInformation.Seats}</Text>
                </Text>
            </View>

            <View style={{flex: 0.25, flexDirection: 'row', padding: 0}}>
                <CustomButton color={'transparent'}
                              text={"View Profile"}
                              buttonStyle={styles.viewProfileButton}
                              textStyle={{color: colors.primary}}
                              onPress={() => {
                                  setShowProfile(true)
                              }}
                />
                <CustomButton onPress={() => {
                    setMessageScreen(!MessageScreen)
                }}
                              color={colors.primary}
                              text={"Message"}
                              buttonStyle={styles.messageButton}/>
            </View>
            {/*these modals are shown if the message or profile buttons are pressed.*/}
            <MessageModal modalVisible={MessageScreen}
                          passedMemberData={memberData}
                          setModalVisible={setMessageScreen}
                          initialScreenConversation={false}/>
            <ProfileModal modalVisible={showProfile}
                          setModalVisible={setShowProfile}
                          setMessageScreen={setMessageScreen}
                          userProfileData={profileData}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    helpModal: {
        backgroundColor: '#00000080',
        padding: 10,
        justifyContent: 'center',
        borderRadius: 20,
        position: 'absolute',
        bottom: 0,
        margin: 10,
    },
    closeIcon: {
        width: 20,
        height: 20,
        right: 0,
        tintColor: colors.primary,
        zIndex: 100,
    },
    routeOwnerText: {
        left: '20%',
        fontSize: 22,
        textDecorationLine: "underline",
        flex: 0.7,
        color: 'white'
    },
    viewProfileButton: {
        borderWidth: 1,
        borderColor: colors.primary,
        height: '100%',
        margin: 0,
        marginRight: 5
    },
    profilePhoto: {
        height: 60,
        width: 60,
        borderRadius: 30,
        flex: 0.2
    },
    messageButton: {
        height: '100%',
        margin: 0,
        marginLeft: 5
    }
})
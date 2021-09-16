import React, {useState} from "react";
import {Switch, Text, View, StyleSheet} from "react-native";

/**
 * custom switch component
 * @param text - text to go next to the switch
 * @param style - style props to pass to the view of the component
 * @param callback - function to callback when value of switch changed. (not implemented)
 * @returns {JSX.Element}
 * @constructor
 */
export const CustomSwitch = ({text, style, callback}) => {
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    return (
        <View style={[styles.switchView, {...style}]}>
            <Switch
                trackColor={{false: "#767577", true: "#FDAF01"}}
                thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
                style={{
                    marginRight: 10
                }}
            />
            <Text style={styles.switchText}>
                {text}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    switchView: {
        alignItems: 'center',
        flexDirection: "row",
        flex: 0.15,
    },
    switchText: {
        color: 'white',
        flexWrap: 'wrap',
        flex: 1
    },})
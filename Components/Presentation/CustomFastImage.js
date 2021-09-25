import React, {useEffect, useRef, useState} from "react";
import {getImageCacheURI} from "../API/NativeAPI";
import {ActivityIndicator, Image, View} from "react-native";

const CustomFastImage = ({source: {uri}, style}) => {
    const [imgUri, setUri] = useState(null)
    getImageCacheURI(uri, setUri)
    return (
        <>
            {imgUri ? (
                <Image source={{ uri: imgUri }} style={style} />
            ) : (
                <View
                    style={{ ...style, alignItems: "center", justifyContent: "center" }}
                >
                    <ActivityIndicator size={33} />
                </View>
            )}
            </>
    )

}

export default CustomFastImage
import React, { useEffect, useRef, useState } from "react";
import { Alert, Image, View, ActivityIndicator } from "react-native";
import * as FileSystem from "expo-file-system";

async function findImageInCache(uri) {
    try {
        let info = await FileSystem.getInfoAsync(uri);
        return { ...info, err: false };
    } catch (error) {
        return {
            exists: false,
            err: true,
            msg: error,
        };
    }
}

const getFileNameFromURI = (uri) => {
   return uri
        .replaceAll('/','')
        .replaceAll('.', '')
        .replaceAll(':', '')
        .replaceAll('%', '')
        .replaceAll('&', '')
        .replaceAll('=','')
        .replaceAll('-','')
}

async function cacheImage(uri, cacheUri, callback) {
    try {
        const downloadImage = FileSystem.createDownloadResumable(
            uri,
            cacheUri,
            {},
            callback
        );
        const downloaded = await downloadImage.downloadAsync();
        return {
            cached: true,
            err: false,
            path: downloaded.uri,
        };
    } catch (error) {
        return {
            cached: false,
            err: true,
            msg: error,
        };
    }
}
const CustomFastImage = (props) => {
    const {
        source: { uri },
        style,
    } = props;
    let cacheKey = getFileNameFromURI(uri)

    const isMounted = useRef(true);
    const [imgUri, setUri] = useState("");
    useEffect(() => {
        async function loadImg() {
            const cacheFileUri = `${FileSystem.cacheDirectory}${cacheKey}`
            let imageExistsInCache = await findImageInCache(cacheFileUri);
            if (imageExistsInCache.exists) {
                console.log("cached!");
                setUri(cacheFileUri);
            } else {
                let cached = await cacheImage(uri, cacheFileUri, () => {});
                if (cached.cached) {
                    console.log("cached NEw!");
                    setUri(cached.path);
                } else {
                    Alert.alert(`Couldn't load Image!`);
                }
            }
        }
        loadImg();
        return () => (isMounted.current = false);
    }, [cacheKey]);
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
    );
};

export const deleteFileFromURI = (uri) => {
    let cacheKey = getFileNameFromURI(uri)
    FileSystem.deleteAsync(`${FileSystem.cacheDirectory}${cacheKey}`, {idempotent: true})
}
export default CustomFastImage;
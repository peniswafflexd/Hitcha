import React, { useEffect, useRef, useState } from "react";
import { Alert, Image, View, ActivityIndicator } from "react-native";
import * as FileSystem from "expo-file-system";

/**
 * A custom cacheable image component for faster loading of images
 * and to save on bandwidth, so every time a component is rendered it
 * doesn't fetch the image from the server. It caches the image
 * in the filesystem with a unique cache-key that is determined from
 * the url.
 * @param props - needs a uri and style prop
 * @returns {JSX.Element}
 * @constructor
 */
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
                setUri(cacheFileUri);
            } else {
                let cached = await cacheImage(uri, cacheFileUri, () => {});
                if (cached.cached) {
                    setUri(cached.path);
                } else {
                    Alert.alert(`Couldn't load Image!`);
                }
            }
        }
        loadImg() // doesn't return anything so no .then()
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

/**
 * gets the data on the image that is in the filesystem based on the uri.
 * @param uri
 * @returns {Promise<{msg, err: boolean, exists: boolean}|{size: number | undefined, err: boolean, modificationTime: number | undefined, exists: true | false, uri: string, isDirectory: boolean | false, md5?: string | undefined}>}
 */
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

/**
 * converts the uri to the file name by taking out most of
 * the specialised characters that are in URL's
 * @param uri
 * @returns {string}
 */
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

/**
 * caches an image by storing it in the filesystem.
 * @param uri - uri of the image.
 * @param cacheUri - the filename for the file to be caches under
 * @returns {Promise<{msg, err: boolean, cached: boolean}|{path: string, err: boolean, cached: boolean}>}
 */
async function cacheImage(uri, cacheUri) {
    try {
        const downloadImage = FileSystem.createDownloadResumable(
            uri,
            cacheUri,
            {},
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

/**
 * deletes the cached image that correlates to the URI passed,
 * does not throw an error if the file isn't found. Is used
 * when a cached file could be out of date.
 * @param uri
 */
export const deleteFileFromURI = (uri) => {
    let cacheKey = getFileNameFromURI(uri)
    FileSystem.deleteAsync(`${FileSystem.cacheDirectory}${cacheKey}`, {idempotent: true}) // no return so no .then()
}
export default CustomFastImage;
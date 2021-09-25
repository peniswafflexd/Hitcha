import React, {useEffect, useRef} from "react";
import {Alert} from "react-native";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import {uploadImage} from "./ProfileAPI";

/**
 * A custom cacheable image component for faster loading of images
 * and to save on bandwidth, so every time a component is rendered it
 * doesn't fetch the image from the server. It caches the image
 * in the filesystem with a unique cache-key that is determined from
 * the url.
 * @returns {JSX.Element}
 * @constructor
 */
export const getImageCacheURI = (uri, setUri) => {
    let cacheKey = getFileNameFromURI(uri)
    const isMounted = useRef(true);
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
/**
 * gets user image and uploads it to firebase
 * @param folder - the folder the image file to change is in
 * @param setIsLoading - state setter for loading screens.
 * @constructor
 */
export const ChangeImage = (folder, setIsLoading) => {
    SelectImage()
        .then((uri) => {
            UploadImage(uri, folder)
                .then(() => {
                    setIsLoading(false)
                    alert("Photo Changed!")
                })
                .catch(error => {
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
 * Creates a blob of a file so that it can be uploaded to
 * fire-storage asynchronously and then uploads it.
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

   await uploadImage(filename, blob, deleteFileFromURI)
}
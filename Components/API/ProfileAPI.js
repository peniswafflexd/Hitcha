import {auth, db, storage} from "./APIConstants";
import {useEffect} from "react";


/**
 * Upload an image to firebase storage and update the photo links on the
 * users custom profile
 * @param folder - the folder to store the photo (covers or avatars)
 * @param blob - a blob of the image to be uploaded
 * @returns {Promise<void>}
 */
export const uploadImage = async (folder, blob, deleteFileCallback) => {
    // reference to the storage location
    const ref = storage.ref().child(folder + "/" + auth.currentUser.uid);

    //upload the image to storage
    await ref
        .put(blob)
        .catch(error => console.log(error.message));

    //get the new URI link of the image in storage
    const downloadURL = await storage.ref(folder + "/" + auth.currentUser.uid).getDownloadURL();

    //Update the user profile, saying which image has been changed
    let data = {}
    if (folder === "covers") data = {"profile.hasCover": true, "profile.coverURL": downloadURL};
    else if (folder === "avatars") {
        data = {"profile.hasProfile": true, "profile.profileURL": downloadURL};
        auth?.currentUser?.updateProfile({
            photoURL: downloadURL
        }).catch((error) => {
            console.log(error.message)
        });
    }
    // // delete the cached version of the image, as now it could be wrong.
    deleteFileCallback(downloadURL)
    await updateUserProfile(data);
}

/**
 * a subscriber for the users profile, automatically gets called when the users
 * profile is changed.
 * @param setProfileData - function to update profileData state
 * @param userID - the userID of the user to subscribe too
 * @constructor
 */
export const ProfileSnapshot = (setProfileData, userID = auth?.currentUser?.uid) => {
    useEffect(() => {
        const subscriber = db
            .collection("Users")
            .doc(userID)
            .onSnapshot(documentSnapshot => {
                setProfileData(documentSnapshot.data());
            }, error => {
                console.log(error)
            })

        return () => {
            subscriber()
        }
    }, [userID]);
}

/**
 * Updates the users profile with the object given, usually imageURL or new bio message
 * @param updateObj - object to update the profile with.
 * @returns {Promise<void>}
 */
export const updateUserProfile = async (updateObj) => {
    await db
        .collection("Users")
        .doc(auth?.currentUser?.uid)
        .update(updateObj)
}


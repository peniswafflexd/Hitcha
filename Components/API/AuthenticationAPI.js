import {auth, db} from "./APIConstants";
import React from "react";
import {setUser} from "../../App";

/**
 * sign the current user out
 */
export const signOutFirebase = () => {
    auth.signOut().then(() => {
        React.render
    }).catch((error) => {
        console.log(error.message)
    });
}
/**
 * Creates new user credentials within firebase
 * @param username - the name of the user
 * @param email - email of the user
 * @param password - users chosen password
 */
export const signUpFirebase = (username, email, password) => {
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            auth.currentUser = userCredential.user;
            React.render
            createNewUserDocument(auth.currentUser, username)
        })
        .catch((error) => {
            console.log(error.code)
            console.log(error.message)
        });
}
/**
 * Creates a blank profile for a new user
 * @param user - the user to create the blank profile for
 * @param name - the name of the user
 */
const createNewUserDocument = (user, name) => {
    // a blank user profile object
    const blankProfile = {
        profile: {
            firstname: name,
            lastname: "",
            hasCover: true,
            hasProfile: true,
            profileURL: "https://prd-wret.s3.us-west-2.amazonaws.com/assets/palladium/production/s3fs-public/styles/full_width/public/thumbnails/image/placeholder-profile_1.png",
            coverURL: "https://wallpapers.net/web/wallpapers/man-carrying-a-backpack-hd-wallpaper/thumbnail/lg.jpg",
            bio: "I'm a new user who hasn't updated their bio yet!"
        }
    }

    //update the firebase default user profile
    user.updateProfile({
        displayName: name,
        photoURL: "https://prd-wret.s3.us-west-2.amazonaws.com/assets/palladium/production/s3fs-public/styles/full_width/public/thumbnails/image/placeholder-profile_1.png"
    }).catch((error) => {
        console.log(error.message)
    });

    //update the custom user profile
    db
        .collection("Users")
        .doc(user.uid)
        .set(blankProfile)
        .catch(error => console.log(error))
}
/**
 * sign a user into the app with firebase
 * @param email - email of user
 * @param password - password of user
 */
export const signInFirebase = (email, password) => {
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            auth.currentUser = userCredential.user;
            React.render
        })
        .catch((error) => {
            console.log(error.code)
            console.log(error.message)
        });
}

/**
 * Change global variables when sign in or sign out is detected
 */
auth.onAuthStateChanged((user) => {
    if (user) {
        setUser(user)
        auth.currentUser = user
    } else {
        setUser(user)
        auth.currentUser = user
    }
});
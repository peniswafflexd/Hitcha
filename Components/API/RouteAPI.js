import React, {useEffect, useState} from 'react';
//import * as firebase from 'firebase'
import firebase from 'firebase/app';
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'
import {setUser} from "../../App";

const firebaseConfig = {
    apiKey: "AIzaSyBrUjZ4_OFibulCxJW4p03DVMNd1UANxOM",
    authDomain: "hitcha-swen325.firebaseapp.com",
    projectId: "hitcha-swen325",
    storageBucket: "hitcha-swen325.appspot.com",
    messagingSenderId: "174726287958",
    appId: "1:174726287958:web:107404bffddeb1f675e1f7",
    measurementId: "G-49P2Q45YH9"
};
// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app(); // if already initialized, use that one
}
export const db = firebase.firestore();
export const auth = firebase.auth();
const storage = firebase.storage();

export const signOutFirebase = () => {
    auth.signOut().then(() => {
        React.render
    }).catch((error) => {
        console.log(error.message)
    });
}

auth.onAuthStateChanged((user) => {
    if (user) {
        // alert("User logged In")
        setUser(user)
        auth.currentUser = user
    } else {
        // alert("User Logged Out")
        setUser(user)
        auth.currentUser = user
    }
});


export const signUpFirebase = (username, email, password, callBack) => {
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

const createNewUserDocument = (user, name) => {
    const blankProfile = {
        profile: {
            firstname: name,
            lastname: "",
            hasCover: false,
            hasProfile: false,
            bio: "I'm a new user who hasn't updated their bio yet!"
        }
    }

    user.updateProfile({
        displayName: name,
        photoURL: "https://prd-wret.s3.us-west-2.amazonaws.com/assets/palladium/production/s3fs-public/styles/full_width/public/thumbnails/image/placeholder-profile_1.png"
    }).catch((error) => {
        console.log(error.message)
    });

    db
        .collection("Users")
        .doc(user.uid)
        .set(blankProfile)
        .catch(error => console.log(error))
}

export const signInFirebase = (email, password, callBack) => {
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


export const addRoute = (route) => {
    db
        .collection("Routes")
        .doc(auth?.currentUser?.uid)
        .set(route)
        .then(() => {
            alert("Route Added")
        })
}

export const getRoutes = async () => {
    await db
        .collection('Routes')
        .get()
        .then((data) => {
                console.log(data)
            }
        )
}

export const uploadImage = async (folder, blob) => {
    const ref = storage.ref().child(folder + "/" + auth.currentUser.uid);
// Upload blob to Firebase
    const task = await ref
        .put(blob)
        .catch(error => console.log(error.message));

    const downloadURL = await storage.ref(folder + "/" + auth.currentUser.uid).getDownloadURL();

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
    await updateUserProfile(data);
}

export const UpdatedRoutes = (routes, setRoutes) => {
    useEffect(() => {
        const subscriber = db.collection("Routes")
            .onSnapshot(querySnapshot => {
                    let changes = querySnapshot.docChanges();
                    setRoutes(changes
                        .filter((change) => change.type === 'added')
                        .map((change) => change.doc));
                },
                error => {
                    console.log(error)
                })

        return () => {
            subscriber()
        }
    }, []);
}

export const ProfileSnapshot = (setProfileData) => {
    useEffect(() => {
        const subscriber = db
            .collection("Users")
            .doc(auth.currentUser.uid)
            .onSnapshot(documentSnapshot => {
                setProfileData(documentSnapshot.data());
            }, error => {
                console.log(error)
            })

        return () => {
            subscriber()
        }
    }, []);
}

export const getImageURL = (path, setImage) => {
    storage
        .ref("/" + path)
        .getDownloadURL()
        .then(url => {
            setImage(url)
        }).catch(error => console.log(error.code))
}

export const updateUserProfile = async (updateObj) => {
    await db
        .collection("Users")
        .doc(auth.currentUser.uid)
        .update(updateObj);
}

const getRouteInformation = async (userIdString) => {
    const snapshot = db.collection("Routes").doc(userIdString).get();
    return await snapshot
}

const getUserInformation = async (userIdString) => {
    const snapshot = db.collection("Users").doc(userIdString).get();
    return await snapshot
}

export const getInformation = async (userIdString) => {
    return (await getRouteInformation(userIdString)).data()

}
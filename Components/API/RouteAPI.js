import React, {useEffect} from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'
import {setUser} from "../../App";
import {deleteFileFromURI} from "../CustomFastImage";

/**
 * Firebase configuration with API Key
 * @type {{storageBucket: string, apiKey: string, messagingSenderId: string, appId: string, projectId: string, measurementId: string, authDomain: string}}
 */
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

//some global variables.
export const db = firebase.firestore();
export const auth = firebase.auth();
const storage = firebase.storage();

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
            coverURL: "http://wallpapers.net/web/wallpapers/man-carrying-a-backpack-hd-wallpaper/thumbnail/lg.jpg",
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
 * Add a route to the list of routes in firebase, use the
 * current users uid to store the route so they can only have
 * one at a time.
 * @param route - the route to be added
 */
export const addRoute = (route) => {
    db
        .collection("Routes")
        .doc(auth?.currentUser?.uid)
        .set(route)
        .then(() => {
            alert("Route Added")
        })
}

/**
 * DEPRECATED - get all user routes, (replaced with onSnapshot version)
 * @returns {Promise<void>}
 */
export const getRoutes = async () => {
    await db
        .collection('Routes')
        .get()
        .then((data) => {
                console.log(data)
            }
        )
}

/**
 * Upload an image to firebase storage and update the photo links on the
 * users custom profile
 * @param folder - the folder to store the photo (covers or avatars)
 * @param blob - a blob of the image to be uploaded
 * @returns {Promise<void>}
 */
export const uploadImage = async (folder, blob) => {
    // reference to the storage location
    const ref = storage.ref().child(folder + "/" + auth.currentUser.uid);

    //upload the image to storage
    const task = await ref
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
    // delete the cached version of the image, as now it could be wrong.
    deleteFileFromURI(downloadURL)
    await updateUserProfile(data);
}

/**
 * a subscriber for the routes collection in firebase, automatically gets
 * called when the routes are changed on the server.
 * @param routes - current list of routes
 * @param setRoutes - function to update list of routes
 * @constructor
 */
export const UpdatedRoutes = (routes, setRoutes) => {
    useEffect(() => {
        const subscriber = db
            .collection("Routes")
            .onSnapshot(querySnapshot => {
                    let docs = querySnapshot.docs
                    setRoutes(docs)
                },
                error => {
                    console.log(error)
                })

        return () => {
            subscriber()
        }
    }, []);
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
 * UNUSED - gets an image URL (TODO: check if this can be deleted)
 * @param path
 * @param setImage
 */
export const getImageURL = (path, setImage) => {
    storage
        .ref("/" + path)
        .getDownloadURL()
        .then(url => {
            setImage(url)
        }).catch(error => console.log(error.code))
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

/**
 * Calls database to get the information on a specific route and returns the promise
 * @param userIdString
 * @returns {Promise<firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>>}
 */
const getRouteInformation = async (userIdString) => {
    const snapshot = db
        .collection("Routes")
        .doc(userIdString)
        .get();
    return await snapshot
}

/**
 * gets the information on a specific route and returns the data.
 * @param userIdString
 * @returns {Promise<firebase.firestore.DocumentData>}
 */
export const getInformation = async (userIdString) => {
    return (await getRouteInformation(userIdString)).data()

}

/**
 * Takes a memberID and uses it to calculate the conversationID, when called
 * it will check to see if the user has a conversation with them already and
 * if not then it will add the conversation to the conversation list.
 * @param memberID - memberID of the user to get the conversationID of
 * @param memberName - the name of the member to message
 * @param photoURL - photoURL of the member to message
 * @returns {*}
 */
export const getConversationID = (memberID, memberName, photoURL) => {
    //get the conversationID
    let conversationID;
    if (auth?.currentUser?.uid < memberID) conversationID = auth?.currentUser?.uid + memberID
    else conversationID = memberID + auth?.currentUser?.uid

    //get the reference to the document of the conversation
    const conversationRef = db.collection('Users')
        .doc(auth?.currentUser?.uid)
        .collection("Conversations")
        .doc(memberID)

    //if the document doesn't exist then create it.
    conversationRef.get()
        .then((docSnapshot) => {
            if (!docSnapshot.exists) {
                conversationRef.set({
                    conversationID: conversationID,
                    name: memberName,
                    photoURL: photoURL
                }) // create the document
            }
        });

    return conversationID;
}

/**
 * gets a list of all of the current users conversations as a subscriber,
 * so when it's updated on the server it will be called here.
 * @param conversations - the current list of conversations
 * @param setConversations - the function to set the state of the list of conversations.
 */
export const getAllConversationUsers = (conversations, setConversations) => {
    useEffect(() => {
        const subscriber = db
            .collection("Users")
            .doc(auth?.currentUser?.uid)
            .collection("Conversations")
            .onSnapshot(querySnapshot => {
                    let conversations = querySnapshot.docs
                    setConversations(conversations)
                },
                error => {
                    console.log(error)
                })

        return () => {
            subscriber()
        }
    }, []);
}

/**
 * UNUSED - A subscriber to a certain users profileData
 * TODO: see if this is actually used, if not delete it
 * @param userID
 * @param setProfileData
 */
export const getUserProfileData = (userID, setProfileData) => {
    useEffect(() => {
        const subscriber = () => {
            db
                .collection('Users')
                .doc(userID)
                .onSnapshot((QuerySnapshot) => {
                        setProfileData(QuerySnapshot.data())
                    },
                    error => {
                        console.log(error)
                    })
        }

        return () => {
            subscriber()
        };
    }, []);

}

/**
 * Sends a message to a user and then updates the conversation list in their
 *  profile, to let them know that they have a new message.
 * @param messages - a list of messages in the conversation
 * @param conversationID - the conversationID of the conversation to send the message to
 * @param userID - userID of the person who is being messaged
 */
export const sendMessage = (messages, conversationID, userID) => {
    //get the message details from the list of messages
    const {
        _id,
        createdAt,
        text,
        user
    } = messages[0]

    //creates a new message document in the conversation collection in firebase
    db.collection('chats')
        .doc(conversationID)
        .collection("messages")
        .add({
            _id,
            createdAt,
            text,
            user
        })

    // update the other users conversationList to let them know they have a new unread message
    db.collection("Users")
        .doc(userID)
        .collection("Conversations")
        .doc(auth?.currentUser?.uid)
        .set({
            conversationID: conversationID,
            name: auth?.currentUser?.displayName,
            photoURL: auth?.currentUser?.photoURL,
            message: text,
            unread: true
        })
}

/**
 * Updates the current users conversation list to say that the message
 * newest message has been read.
 * @param memberID - the ID of the of the person who sent the message thats been read
 */
export const readMessage = (memberID) => {
    db.collection("Users")
        .doc(auth?.currentUser?.uid)
        .collection("Conversations")
        .doc(memberID)
        .update({
            unread: false
        })
}

/**
 * Gets a route that is assigned to a user (the current user by default)
 * @param setUserRoute - the function to set the state of the userRoute
 * @param memberID - the id of the member that owns the route (if left blank, will default to current user)
 */
export const getUserRoute = (setUserRoute, memberID = auth?.currentUser?.uid) => {
    useEffect(() => {
        const subscriber = db
            .collection("Routes")
            .doc(memberID)
            .onSnapshot(documentSnapshot => {
                setUserRoute(documentSnapshot.data());
            }, error => {
                console.log(error)
            })

        return () => {
            subscriber()
        }
    }, []);
}

/**
 * Deletes a route from the database
 * @param memberID - the id of the person who owns the route.
 */
export const deleteRoute = (memberID = auth?.currentUser?.uid) => {
    db
        .collection("Routes")
        .doc(memberID)
        .delete()
        .then(() => alert("Route Removed"))
}

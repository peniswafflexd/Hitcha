import firebase from "firebase";

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
export const storage = firebase.storage();
export const GoogleAPIKey = 'AIzaSyDFlHhJbSiC2PhIbGT0o6kl0FfBKfh9LP8'
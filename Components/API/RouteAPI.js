import React, {useEffect} from 'react';
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'
import {auth, db} from "./APIConstants";

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
 * gets the information on a specific route and returns the data.
 * @param userIdString - ID of the user who owns the route.
 * @returns {Promise<firebase.firestore.DocumentData>}
 */
export const getRouteInformation = async (userIdString) => {
    const snapshot = db
        .collection("Routes")
        .doc(userIdString)
        .get();
    return (await snapshot).data()
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

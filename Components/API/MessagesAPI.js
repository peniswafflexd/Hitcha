import {auth, db} from "./APIConstants";
import {useEffect} from "react";

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
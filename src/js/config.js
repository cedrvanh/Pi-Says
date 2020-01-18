import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAH5opnXbXMVyfsY3nNkZeYIfZe0vcCYOI",
    authDomain: "pi-simonsays.firebaseapp.com",
    databaseURL: "https://pi-simonsays.firebaseio.com",
    projectId: "pi-simonsays",
    storageBucket: "pi-simonsays.appspot.com",
    messagingSenderId: "773228748604",
    appId: "1:773228748604:web:50fdb3dc22bd9f80ff8839"
};

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();

export const getData = async (field) => {
    const doc = await db.collection('game').doc(field).get();
    return doc.data();
}

export const watchData = async (field) => {
    return new Promise((resolve, reject) => {
        db.collection('game').doc(field).onSnapshot(doc => {
                const data = doc.data();
                resolve(data);
            }, reject)
    })
}

export const saveData = async (field, data) => {
    await db.collection('game').doc(field).update(data);
}
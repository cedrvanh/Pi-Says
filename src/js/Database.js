import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

export default class Database {
    constructor() {
        this.db = firebase.firestore();
        this.auth = firebase.auth();
    }

    getData = async (uid) => {
        const doc = await this.db.collection('users').doc(uid).get();
        return doc.data();
    }

    watchData = (uid) => {
        return new Promise((resolve, reject) => {
            this.db.collection('users').doc(uid).onSnapshot(doc => {
                const data = doc.data();
                resolve(data);
            }, reject)
        })
    }

    updateData = async (uid, data) => {
        await this.db.collection('users').doc(uid).update(data);
    }

    login = async (email, password) => {
        await this.auth.signInWithEmailAndPassword(email, password);
    }

    loginAnonymous = async () => {
        await this.auth.signInAnonymously();
    }

    getAuthState = () => {
        return new Promise((resolve, reject) => {
            this.auth.onAuthStateChanged(user => {
                resolve(user);
            }, reject)
        })
    }

    getUserID = () => {
        return this.auth.currentUser.uid
    }
}
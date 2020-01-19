import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

export default class Database {
    constructor() {
        this.db = firebase.firestore();
        this.auth = firebase.auth();
    }

    getData = async (field) => {
        const doc = await this.db.collection('game').doc(field).get();
        return doc.data();
    }

    watchData = (field) => {
        return new Promise((resolve, reject) => {
            this.db.collection('game').doc(field).onSnapshot(doc => {
                const data = doc.data();
                resolve(data);
            }, reject)
        })
    }

    updateData = async (field, data) => {
        await this.db.collection('game').doc(field).update(data);
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
}
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

    getScores = async () => {
        const snapshot = await this.db.collection('users').where('highscore', '>', 0).orderBy('highscore', 'desc').limit(10).get()
        return snapshot.docs.map(doc => {
            return doc.data();
        });
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

    logout = async () => {
        await this.auth.signOut();
    }

    getAuthState = () => {
        return new Promise((resolve, reject) => {
            this.auth.onAuthStateChanged(user => {
                resolve(user);
            }, reject)
        })
    }

    createUser = async (uid) => {
        await this.db.collection('users').doc(uid).set({
            highscore: 0,
            player_pattern: [],
            sequence_pattern: []
        })
    }

    getUserID = () => {
        return this.auth.currentUser.uid
    }
}
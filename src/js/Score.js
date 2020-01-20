import { db } from './Config';
import Database from './Database';

let scoreControl = document.querySelector('.board__controls-score');

export default class Score {
    constructor(score = 0) {
        this.score = score;
        this._db = new Database() 
    }

    update() {
        this.score++;
        scoreControl.innerHTML = this.score;
    }

    async save() {
        const uid = this._db.getUserID();
        const doc = await db.collection('users').doc(uid).get();
        const { highscore } = doc.data();
        
        if (this.score > highscore) {
            console.log('You beat your highscore!');
            await db.collection('users').doc(uid).update({
                highscore: this.score
            });
        } else {
            console.log('You did not beat your highscore');
        }

        this.reset();
    }

    reset() {
        this.score = 0;
    }
}
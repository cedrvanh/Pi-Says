import { db } from './Config';

let scoreControl = document.querySelector('.board__controls-score');

export default class Score {
    constructor(score = 0) {
        this.score = score;
    }

    update() {
        this.score++;
        scoreControl.innerHTML = this.score;
    }

    async save() {
        const doc = await db.collection('game').doc('highscore').get();
        const { amount: highscore } = doc.data();
        if (this.score > highscore) {
            console.log('You beat your highscore!');
            await db.collection('game').doc('highscore').update({
                amount: this.score
            });
        } else {
            console.log('You did not beat your highscore');
        }
    }
}
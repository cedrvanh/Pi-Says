import { db } from './Config';
import Database from './Database';

let scoreControl = document.querySelector('.board__controls-score');

export default class Score {
    constructor(score = 0) {
        this.score = score;
        this._db = new Database();
        this.uid = this._db.getUserID();
    }

    update() {
        this.score++;
        scoreControl.innerHTML = this.score;
    }

    async save() {
        let highscoreNotification = document.querySelector('.highscore__notification');

        const { highscore } = await this._db.getData(this.uid);

        if (this.score > highscore) {
            console.log('You beat your highscore!');
            await this._db.updateData(this.uid, {
                highscore: this.score
            })
            highscoreNotification.innerHTML = `
                You beat your highscore! <i class="fas fa-laugh-beam"></i> 
            `
        } else {
            console.log('You did not beat your highscore');
            highscoreNotification.innerHTML = `
                You did not beat your highscore! <i class="fas fa-thumbs-down"></i> 
            `
        }

        this.reset();
    }

    reset() {
        this.score = 0;
    }
}
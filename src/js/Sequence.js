import { getRandomNumber, toggleButton, getColorById, delay } from './Utils';
import Sound from './Sound';
import Database from './Database';

const audioFiles = [
    'http://www.soundjay.com/button/sounds/button-4.mp3',
    'http://www.soundjay.com/button/sounds/button-5.mp3',
    'http://www.soundjay.com/button/sounds/button-6.mp3',
    'http://www.soundjay.com/button/sounds/button-7.mp3'
];

export default class Sequence {
    constructor(pattern = []) {
        this.pattern = pattern;
        this.sound = new Sound(audioFiles);
        this._db = new Database();
        this.uid = this._db.getUserID();
    }

    init() {
        const newSequence = getRandomNumber();
        this.pattern.push(newSequence);
        this._db.updateData(this.uid, {
            sequence_pattern: this.pattern
        })
        this.play(newSequence);
    }

    play(id) {
        const color = getColorById(id);
        toggleButton(id, color);
        this.sound.play(id);
    }

    next() {
        const nextSequence = getRandomNumber();
        this.pattern.push(nextSequence);
        this._db.updateData(this.uid, {
            sequence_pattern: this.pattern
        })
        this.show();
    }

    show() {
        let i = 0;
        const sequenceInterval = setInterval(() => {
            this.play(this.pattern[i]);
            i++;
            if (i >= this.pattern.length) {
                clearInterval(sequenceInterval);
            }
        }, delay * 3);
    }

    reset() {
        this.pattern = [];
        this._db.updateData(this.uid, {
            sequence_pattern: this.pattern
        })
    }
}
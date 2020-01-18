import { getRandomNumber, toggleButton, getColorById, delay } from './utils';
import Sound from './Sound';

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
    }

    init() {
        const newSequence = getRandomNumber();
        this.pattern.push(newSequence);
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
        }, delay * 2);
    }

    reset() {
        this.pattern = [];
    }
}
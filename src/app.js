import '@fortawesome/fontawesome-free/js/all.js';
import { initFirebase, db } from './js/config';
import './styles/main.scss';

let buttons = document.querySelectorAll('.board__section');
let playControl = document.querySelector('.board__controls-start');
let scoreControl = document.querySelector('.board__controls-score');
const audioFiles = [
    'http://www.soundjay.com/button/sounds/button-4.mp3',
    'http://www.soundjay.com/button/sounds/button-5.mp3',
    'http://www.soundjay.com/button/sounds/button-6.mp3',
    'http://www.soundjay.com/button/sounds/button-7.mp3'
];
const delay = 500;

class Game {
    constructor() {
        this.hasStarted = false;
        this.sequence = new Sequence();
        this.player = new Player();
        this.score = new Score();
    }

    init() {
        console.log('Starting game');
        this.hasStarted = true;
        this.initButtonClasses();
        this.initButtonListeners();
        this.sequence.init();
        this.score.update();
    }

    initButtonClasses() {
        toggleClass(playControl, 'is-hidden');
        toggleClass(scoreControl, 'is-hidden');
    }

    initButtonListeners() {
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const id = JSON.parse(button.id);
                this.handleInput(id);
            });
        });
    }

    handleInput(id) {
        this.player.pattern.push(id);
        this.sequence.play(id);

        if (this.sequence.pattern[this.player.pattern.length - 1] == this.player.pattern[this.player.pattern.length - 1]) {
            if (this.sequence.pattern.length === this.player.pattern.length) {
                console.log('Good move, next level');
                this.sequence.next();
                this.player.reset();
                this.score.update();
            }
        } else {
            console.log('Wrong move, try again');
            this.sequence.reset();
            this.score.save();
        }
    }
}

class Player {
    constructor(pattern = []) {
        this.pattern = pattern;
    }

    reset() {
        this.pattern = [];
    }
}

class Score {
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

class Sequence {
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

class Sound {
    constructor(path = []) {
        this.path = path;
    }

    play(id) {
        const audio = new Audio(this.path[id]);
        audio.volume = 0.1;
        audio.play();
    }
}

const getRandomNumber = () => Math.floor(Math.random() * 4);

// Adds button active state
const toggleButton = (id, color) => {
    const button = document.getElementById(`${id}`);
    toggleClass(button, `${color}--active`);
    setTimeout(() => toggleClass(button, `${color}--active`), delay);
}

// Toggle element class name
const toggleClass = (element, className) => {
    element.classList.toggle(`${className}`);
};

// Returns button color by ID
// Green = 0, Red = 1, Yellow = 2, Blue = 3
const getColorById = (id) => {
    let color;
    switch (id) {
        case 0:
            color = 'green';
            break;
        case 1:
            color = 'red';
            break;
        case 2:
            color = 'yellow';
            break;
        case 3:
            color = 'blue';
            break;
        default:
            break;
    }
    return color;
}

const game = new Game();
playControl.addEventListener('click', () => game.init());


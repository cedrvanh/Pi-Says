import { toggleClass, delay } from './utils';
import Sequence from './Sequence';
import Player from './Player';
import Score from './Score';

let buttons = document.querySelectorAll('.board__section');
let playControl = document.querySelector('.board__controls-start');
let scoreControl = document.querySelector('.board__controls-score');

export default class Game {
    constructor() {
        this.hasStarted = false;
        this.sequence = new Sequence();
        this.player = new Player();
        this.score = new Score();
    }

    init() {
        console.log('Starting game');
        this.initButtonClasses();
        this.initButtonListeners();
        this.sequence.init();
        this.score.update();
        this.hasStarted = true;
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
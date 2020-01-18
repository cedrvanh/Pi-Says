import Game from './js/Game';
import { db, watchData, saveData } from './js/Config';

import '@fortawesome/fontawesome-free/js/all.js';
import './styles/main.scss';

let playControl = document.querySelector('.board__controls-start');
let highscoreSpan = document.querySelector('.highscore');
let sequence = [];
let player = [];

(async () => {
    watchData('highscore').then(res => {
        const { amount: highscore } = res;
        highscoreSpan.innerHTML = highscore;
    });

    watchData('sequence').then(res => {
        sequence = res.pattern;
    });

    watchData('player').then(res => {
        player = res.pattern;
    });

    saveData('sequence', { 
        pattern: sequence
    });
})();

const game = new Game(sequence, player);
playControl.addEventListener('click', () => game.init());


import '@fortawesome/fontawesome-free/js/all.js';
import './styles/main.scss';
import Game from './js/Game';

let buttons = document.querySelectorAll('.board__section');
let playControl = document.querySelector('.board__controls-start');
let scoreControl = document.querySelector('.board__controls-score');



const game = new Game();
playControl.addEventListener('click', () => game.init());


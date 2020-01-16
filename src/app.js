import { initFirebase } from './js/config';
import '@fortawesome/fontawesome-free/js/all.js';
import './styles/main.scss';

let hasStarted = false;
let audioFiles = [
    'http://www.soundjay.com/button/sounds/button-4.mp3',
    'http://www.soundjay.com/button/sounds/button-5.mp3',
    'http://www.soundjay.com/button/sounds/button-6.mp3',
    'http://www.soundjay.com/button/sounds/button-7.mp3'
];

const getRandomNumber = () => {
    const rand = Math.floor(Math.random() * 4);
    return rand;
};

const startGame = () => {
    initButtonListeners();
    console.log('Clicked');
    hasStarted = true
};

const playAudio = (id) => {
    const audio = new Audio(audioFiles[id]);
    audio.volume = 0.1;
    audio.play();
};

const initButtonListeners = () => {
    let buttons = document.querySelectorAll('.board__section');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const color = button.className.split(" ")[1];
            const id = button.id;
            console.log(`Clicked button ${color}`)

            playAudio(id)
        });
    });
};

let playBtn = document.querySelector('#playBtn');
playBtn.addEventListener('click', startGame);
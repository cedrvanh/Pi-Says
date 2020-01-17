import { initFirebase } from './js/config';
import '@fortawesome/fontawesome-free/js/all.js';
import './styles/main.scss';

let buttons = document.querySelectorAll('.board__section');
let playControl = document.querySelector('.board__controls-start');
let scoreControl = document.querySelector('.board__controls-score');

let sequence = [];
let user = [];
let score = 0;
let color;
let hasStarted = false;
const audioFiles = [
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
    // Initialize button classes
    initButtonClasses();
    // Initialize button click events 
    initButtonListeners();
    // Initialize Simon Says sequence
    initSequence();
    hasStarted = true;
};

const playAudio = (id) => {
    const audio = new Audio(audioFiles[id]);
    audio.volume = 0.1;
    audio.play();
};

const initButtonClasses = () => {
    toggleClass(playControl, 'is-hidden');
    toggleClass(scoreControl, 'is-hidden');
}

const initButtonListeners = () => {
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const color = button.className.split(" ")[1];
            const id = JSON.parse(button.id);
            handleUserInput(id);
            // nextSequence();
        });
    });
};

const initSequence = () => {
    const currentSequence = getRandomNumber();
    sequence.push(currentSequence);
    addButtonEvent(currentSequence, getColorById(currentSequence));
}

const nextSequence = () => {
    const nextSequence = getRandomNumber();
    sequence.push(nextSequence);
    addButtonEvent(nextSequence, getColorById(nextSequence));
}

const validateSequence = () => {
    for(let i = 0; i < user.length; i++) {
        if(user[i] !== sequence[i]) {
            return false;
        }
    }
    return true;
}

const handleUserInput = (id) => {
    const color = getColorById(id);
    console.log(`Clicked button ${color}`);
    user.push(id);
    console.log(validateSequence());
}

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

const changeScore = () => {
    score++;
    scoreControl.innerHTML += score;
}

const addButtonEvent = (id, color = 'green') => {
    toggleButton(id, color);
    // playAudio(id);    
}

const toggleButton = (id, color) => {
    const button = document.getElementById(`${id}`);
    toggleClass(button, `${color}--active`);
    setTimeout(() => toggleClass(button, `${color}--active`), 1000);
}

const toggleClass = (element, className) => {
    element.classList.toggle(`${className}`);
};

playControl.addEventListener('click', startGame);

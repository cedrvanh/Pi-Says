import '@fortawesome/fontawesome-free/js/all.js';

import { initFirebase, db } from './js/config';
import './styles/main.scss';

// Selectors
let buttons = document.querySelectorAll('.board__section');
let playControl = document.querySelector('.board__controls-start');
let scoreControl = document.querySelector('.board__controls-score');
let highscoreSpan = document.querySelector('.highscore');

// Game variables
const delay = 500;
const audioFiles = [
    'http://www.soundjay.com/button/sounds/button-4.mp3',
    'http://www.soundjay.com/button/sounds/button-5.mp3',
    'http://www.soundjay.com/button/sounds/button-6.mp3',
    'http://www.soundjay.com/button/sounds/button-7.mp3'
];
let sequence = [];
let player = [];
let score = 0;
let color;
let hasStarted = false;

// Start Simon Says game 
const startGame = () => {
    // Initialize button classes
    initButtonClasses();
    // Initialize button click events 
    initButtonListeners();
    // Initialize Simon Says sequence
    initSequence();
    // Game status 
    hasStarted = true;
};

// Set controls visiblity when game starts
const initButtonClasses = () => {
    toggleClass(playControl, 'is-hidden');
    toggleClass(scoreControl, 'is-hidden');
}

// Go through button flow when player clicks on a button
const initButtonListeners = () => {
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const id = JSON.parse(button.id);
            handleUserInput(id);
            // nextSequence();
            // console.log(sequence);
            // console.log(player);
            // console.log(validateSequence());
        });
    });
};

// Initializes starting sequence
const initSequence = () => {
    const newSequence = getRandomNumber();
    sequence.push(newSequence);
    playSequence(newSequence);
    updateScore();
}

// Activate button state (Play audio + set button styling)
const playSequence = (id) => {
    const color = getColorById(id);
    toggleButton(id, color);
    // playAudio(id);    
}

// Handles next sequence when player correctly inputs the current sequence
const nextSequence = () => {
    const nextSequence = getRandomNumber();
    sequence.push(nextSequence);
    showSequence();
    updateScore();
}

// Go through current sequence and changes button states
const showSequence = () => {
    let i = 0;
    const sequenceInterval = setInterval(() => {
        playSequence(sequence[i]);
        i++;
        if (i >= sequence.length) {
            clearInterval(sequenceInterval);
        }
    }, delay * 2);
    player = [];
}

const resetSequence = () => {
    sequence = [];
    score = 0;
    hasStarted = false;
    initButtonClasses();
}

// Handles game flow when users presses a button
// Checks if player input is correct
const handleUserInput = (id) => {
    player.push(id);
    playSequence(id);

    // If player input is correct, start next move, otherwise show moves again
    if (sequence[player.length - 1] == player[player.length - 1]) {
        if (sequence.length === player.length) {
            console.log('Good move, next level');
            nextSequence();
        }
    } else {
        console.log('Wrong move, try again');
        saveScore();
        resetSequence();
        // showSequence();
    }
}

// Increments player score and sets in DOM
const updateScore = () => {
    score++;
    scoreControl.innerHTML = score;
}

const saveScore = async () => {
    const doc = await db.collection('game').doc('highscore').get();
    const { amount: highscore } = doc.data();
    if (score > highscore) {
        console.log('You beat your highscore!');
        await db.collection('game').doc('highscore').update({
            amount: score
        });
    } else {
        console.log('You did not beat your highscore');
    }
}

// Play sound depending on id
const playAudio = (id) => {
    const audio = new Audio(audioFiles[id]);
    audio.volume = 0.1;
    audio.play();
};

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

// Returns random ID between 0 - 3
const getRandomNumber = () => Math.floor(Math.random() * 4);

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

// Listener to start Simon Says game
playControl.addEventListener('click', startGame);

(async () => {
    const doc = await db.collection('game').doc('highscore').get();
    const { amount: highscore } = doc.data();
    highscoreSpan.innerHTML = highscore;
})();
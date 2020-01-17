import { initFirebase } from './js/config';
import '@fortawesome/fontawesome-free/js/all.js';
import './styles/main.scss';

// Selectors
let buttons = document.querySelectorAll('.board__section');
let playControl = document.querySelector('.board__controls-start');
let scoreControl = document.querySelector('.board__controls-score');

// Game variables
let sequence = [];
let user = [];
let score = 0;
let color;
let hasStarted = false;
const delay = 750;
const audioFiles = [
    'http://www.soundjay.com/button/sounds/button-4.mp3',
    'http://www.soundjay.com/button/sounds/button-5.mp3',
    'http://www.soundjay.com/button/sounds/button-6.mp3',
    'http://www.soundjay.com/button/sounds/button-7.mp3'
];

// Returns random ID between 0 - 3
const getRandomNumber = () => {
    const rand = Math.floor(Math.random() * 4);
    return rand;
};

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

// Play sound depending on id
const playAudio = (id) => {
    const audio = new Audio(audioFiles[id]);
    audio.volume = 0.1;
    audio.play();
};

// Set controls visiblity when game starts
const initButtonClasses = () => {
    toggleClass(playControl, 'is-hidden');
    toggleClass(scoreControl, 'is-hidden');
}

// Go through button flow when user clicks on a button
const initButtonListeners = () => {
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const color = button.className.split(" ")[1];
            const id = JSON.parse(button.id);
            handleUserInput(id);
            // nextSequence();
            console.log(sequence);
            console.log(user);
            console.log(validateSequence());
        });
    });
};

// Initializes starting sequence
const initSequence = () => {
    const newSequence = getRandomNumber();
    sequence.push(newSequence);
    playSequence(newSequence);
}

// Handles next sequence when user correctly inputs the current sequence
const nextSequence = () => {
    changeScore();

    const nextSequence = getRandomNumber();
    sequence.push(nextSequence);

    showSequence();
}

// Go through current sequence and changes button states
const showSequence = () => {
    let i = 0;
    const sequenceInterval = setInterval(() => {
        playSequence(sequence[i]);
        i++;
        if(i >= sequence.length) {
            clearInterval(sequenceInterval);
        }
    }, delay);
    user = [];
}

// Check if user pattern matches generated sequence
const validateSequence = () => {
    if(sequence[user.length - 1] !== user[user.length - 1]) {
        if(sequence.length === user.length) {
            return true;
        }
    } 
    return false;
}

// Handles game flow when users presses a button
// Checks if user input is correct
const handleUserInput = (id) => {
    user.push(id);
    playSequence(id);

    // If user input is correct, start next move, otherwise show moves again
    if(sequence[user.length - 1] == user[user.length - 1]) {
        if(sequence.length === user.length) {
            console.log('Good move, next level');
            nextSequence();
        }
    } else {
        console.log('Wrong move, try again');
        showSequence();
    }
}

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

// Increments user score and sets in DOM
const changeScore = () => {
    score++;
    scoreControl.innerHTML = score;
}

// Activate button state (Play audio + set button styling)
const playSequence = (id) => {
    const color = getColorById(id);
    toggleButton(id, color);
    // playAudio(id);    
}

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

// Listener to start Simon Says game
playControl.addEventListener('click', startGame);

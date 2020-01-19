import Game from './js/Game';
import Database from './js/Database';
import { watchData } from './js/Config';

import '@fortawesome/fontawesome-free/js/all.js';
import './styles/main.scss';

let loginForm = document.querySelector('.login');
let loginBtn = document.querySelector('#loginBtn');
let guestBtn = document.querySelector('.login__guest');

const _db = new Database();

const initApp = () => {
    let playControl = document.querySelector('.board__controls-start');
    let highscoreSpan = document.querySelector('.highscore');
    let sequence = [];
    let player = [];

    _db.watchData('highscore').then(res => {
        const { amount: highscore } = res;
        highscoreSpan.innerHTML = highscore;
    });

    _db.watchData('sequence').then(res => {
        sequence = res.pattern;
    });

    _db.watchData('player').then(res => {
        player = res.pattern;
    });

    const game = new Game(sequence, player);
    playControl.addEventListener('click', () => game.init());
}

const handleLogin = () => {
    let errors = [];
    const email = document.querySelector('#email');
    const password = document.querySelector('#password');

    _db.login(email.value, password.value).catch(err => {
        errors.push(err);
        displayErrors(errors);
    })
}

const handleAnonymousLogin = () => {
    let errors = []

    _db.loginAnonymous().catch(err => {
        errors.push(err);
        displayErrors(errors);
    })
}

const displayErrors = (errors) => {
    const errorDiv = document.querySelector('.errors');
    const inputs = document.querySelectorAll('.form-control');

    inputs.forEach(input => input.classList.add('is-invalid'));
    errors.forEach(error => {
        errorDiv.innerHTML = `<span class="error">${error.message}</span>`;
    });
}

_db.getAuthState().then(user => {
    if (user) {
        if (!loginForm.classList.contains('is-hidden')) {
            loginForm.classList.add('is-hidden');
        }
        initApp();
    } else {
        loginForm.classList.remove('is-hidden');
    }
});

loginBtn.addEventListener('click', handleLogin);
guestBtn.addEventListener('click', handleAnonymousLogin);
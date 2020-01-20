import Game from './js/Game';
import Database from './js/Database';

import '@fortawesome/fontawesome-free/js/all.js';
import './styles/main.scss';

let loginForm = document.querySelector('.login');
let loginBtn = document.querySelector('#loginBtn');
let logoutBtn = document.querySelector('#logoutBtn');
let leaderBoardBtn = document.querySelector('#leaderBoardBtn');
let leaderBoardClose = document.querySelector('#leaderBoardClose');
let guestBtn = document.querySelector('.login__guest');

const _db = new Database();

const initApp = () => {
    let playControl = document.querySelector('.board__controls-start');
    let highscoreSpan = document.querySelector('.highscore');
    let sequence = [];
    let player = [];
    const uid = _db.getUserID();
    renderLeaderBoard()
    _db.watchData(uid).then(res => {
        highscoreSpan.innerHTML = res.highscore;
        sequence = res.sequence_pattern;
        player = res.player_pattern;
    });

    const game = new Game(sequence, player);
    playControl.addEventListener('click', () => game.init());
}

const pushLeaderBoard = () => {
    let container = document.querySelector('.container');
    let leaderboard = document.querySelector('.leaderboard');
    container.classList.add('container--push');
    leaderboard.classList.add('leaderboard--push');
}

const closeLeaderBoard = () => {
    let container = document.querySelector('.container');
    let leaderboard = document.querySelector('.leaderboard');
    container.classList.remove('container--push');
    leaderboard.classList.remove('leaderboard--push');
}

const renderLeaderBoard = async () => {
    let list = document.querySelector('.leaderboard__list');
    const scores = await _db.getScores();

    scores.forEach((score, index) => {
        list.innerHTML += `
            <li class="leaderboard__list-item">
                #${index + 1}: ${score.highscore} Points
            </li>
        `;
    });
}

const handleLogin = () => {
    let errors = [];
    const email = document.querySelector('#email');
    const password = document.querySelector('#password');

    _db.login(email.value, password.value).then(() => {
        location.reload()
    }).catch(err => {
        errors.push(err);
        displayErrors(errors);
    })
}

const handleAnonymousLogin = () => {
    let errors = []

    _db.loginAnonymous().then(() => {
        _db.getAuthState().then(user => {
            _db.createUser(user.uid).then(() => {
                location.reload()
            })
        })
    }).catch(err => {
        errors.push(err);
        displayErrors(errors);
    })
}

const handleLogout = () => {
    _db.logout().then(() => {
        location.reload();
    }).catch(err => console.log(err));
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
logoutBtn.addEventListener('click', handleLogout);
guestBtn.addEventListener('click', handleAnonymousLogin);
leaderBoardBtn.addEventListener('click', pushLeaderBoard);
leaderBoardClose.addEventListener('click', closeLeaderBoard);
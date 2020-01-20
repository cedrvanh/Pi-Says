import Game from './js/Game';
import Database from './js/Database';
import '@fortawesome/fontawesome-free/js/all.js';
import './styles/main.scss';

// DOM elements
let loginForm = document.querySelector('.login');
let loginBtn = document.querySelector('#loginBtn');
let logoutBtn = document.querySelector('#logoutBtn');
let leaderBoardBtn = document.querySelector('#leaderBoardBtn');
let leaderBoardClose = document.querySelector('#leaderBoardClose');
let guestBtn = document.querySelector('.login__guest');

// Create instance of Database class
const _db = new Database();

// Initializes app
const initApp = () => {
    let playControl = document.querySelector('.board__controls-start');
    let highscoreSpan = document.querySelector('.highscore');
    let sequence = [];
    let player = [];
    const uid = _db.getUserID();
    renderLeaderBoard();
    
    // Watches for data changes in firestore and assigns variables to new data
    _db.watchData(uid).then(res => {
        highscoreSpan.innerHTML = res.highscore;
        sequence = res.sequence_pattern;
        player = res.player_pattern;
    });

    // Initializes Game class with sequence and player
    const game = new Game(sequence, player);
    playControl.addEventListener('click', () => game.init());
}

// Toggle off-canvas leaderboard
const toggleLeaderBoard = () => {
    let container = document.querySelector('.container');
    let leaderboard = document.querySelector('.leaderboard');
    container.classList.toggle('container--push');
    leaderboard.classList.toggle('leaderboard--push');
}

// Gets top 10 scores and renders them on the leaderboard
const renderLeaderBoard = async () => {
    let list = document.querySelector('.leaderboard__list');
    const scores = await _db.getScores();

    scores.forEach((score, index) => {
        list.innerHTML += `
            <li class="leaderboard__list-item">
                <span>${index + 1}.</span> ${score.highscore} Points
            </li>
        `;
    });
}

// Logs user into their account
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

// Anonymously login as a guest
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

// Logs current user out
const handleLogout = () => {
    _db.logout().then(() => {
        location.reload();
    }).catch(err => console.log(err));
}

// Catch form errors and display them
const displayErrors = (errors) => {
    const errorDiv = document.querySelector('.errors');
    const inputs = document.querySelectorAll('.form-control');

    inputs.forEach(input => input.classList.add('is-invalid'));
    errors.forEach(error => {
        errorDiv.innerHTML = `<span class="error">${error.message}</span>`;
    });
}

// Checks if the authenticated user is found, then initialize app
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

// Event listeners
loginBtn.addEventListener('click', handleLogin);
logoutBtn.addEventListener('click', handleLogout);
guestBtn.addEventListener('click', handleAnonymousLogin);
leaderBoardBtn.addEventListener('click', toggleLeaderBoard);
leaderBoardClose.addEventListener('click', toggleLeaderBoard);
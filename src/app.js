import './styles/main.scss'
import Game from './js/game'
import { initFirebase } from './js/config'

class App {
    init() {
        initFirebase();
        const game = new Game();
        game.init();
    } 
}

document.addEventListener("DOMContentLoaded", () => {
    const app = new App();
    app.init();
});
export default class Sound {
    constructor(path = []) {
        this.path = path;
        this.lost = 'https://www.soundjay.com/misc/sounds/fail-buzzer-02.mp3';
    }

    play(id) {
        const audio = new Audio(this.path[id]);
        audio.volume = 0.1;
        audio.play();
    }

    lost() {
        const audio = new Audio(this.lost);
        audio.volume = 0.1;
        audio.play();
    }
}
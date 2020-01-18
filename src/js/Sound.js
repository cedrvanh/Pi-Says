export default class Sound {
    constructor(path = []) {
        this.path = path;
    }

    play(id) {
        const audio = new Audio(this.path[id]);
        audio.volume = 0.1;
        audio.play();
    }
}
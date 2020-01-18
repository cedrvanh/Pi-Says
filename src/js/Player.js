export default class Player {
    constructor(pattern = []) {
        this.pattern = pattern;
    }

    reset() {
        this.pattern = [];
    }
}

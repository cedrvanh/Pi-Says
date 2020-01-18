import { saveData } from './Config';

export default class Player {
    constructor(pattern = []) {
        this.pattern = pattern;
    }

    reset() {
        this.pattern = [];
        saveData('player', {
            pattern: this.pattern
        });
    }
}

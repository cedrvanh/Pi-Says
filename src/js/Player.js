import Database from './Database';

export default class Player {
    constructor(pattern = []) {
        this.pattern = pattern;
        this._db = new Database();
        this.uid = this._db.getUserID();
    }

    reset() {
        this.pattern = [];
        this._db.updateData(this.uid, {
            player_pattern: this.pattern
        })
    }
}

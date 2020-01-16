export default class Game {
    constructor(name) {
        this.name = name;
    }
    
    init = () => {
        console.log(`Starting the ${this.name} game`);
    }
}
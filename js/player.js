import Coin from "./coin.js";

export default class Player {

    constructor(scene, x, y, color) {
        this.scene  = scene;
        this.locked = true;
        this.color  = color;
        this.addCoin(x, y);
    }

    getColor() {
        return this.color;
    }

    addCoin(x, y) {
        this.activeCoin = new Coin(this.scene, x, y, this.color);
    }

    moveCoin(x, y) {
        if (this.locked) return;
        this.activeCoin.move(x, y);
    }
}

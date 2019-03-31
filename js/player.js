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
        this.activeCoin = new Coin(this.scene, x, y - 100, this.color);
        this.addWaypoint(x, y + 60, 0.15);
    }

    moveCoin(x, y) {
        if (this.locked) return;
        this.activeCoin.move(x, y);
    }

    addWaypoint(x, y, speed) {
        if (this.locked) return;
        this.activeCoin.addWaypoint(x, y, speed);
    }
}

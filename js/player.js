export default class Player {

    constructor(scene, x, y, color) {
        this.scene = scene;

        this.gameObject = this.scene.add.sprite(x, y, color);
        this.color = color;
    }

    getColor() {
        return this.color;
    }

    move(x, y) {
        this.gameObject.x = x;
        this.gameObject.y = y;
    }
}

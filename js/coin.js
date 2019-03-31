export default class MySprite extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        this.scene  = scene;
        this.toX    = x;
        this.toY    = y;
        this.moveTo = false;

        this.scene.add.existing(this);
    }

    move(x, y) {
        this.toX    = x;
        this.toY    = y;
        this.moveTo = true;
    }

    preUpdate(time, delta) {
        if (this.moveTo) {
            this.x += (this.toX - this.x)*0.25;
            this.y += (this.toY - this.y)*0.25;
            if (Math.abs(this.toX - this.x) <= 0.01 && Math.abs(this.toY - this.y) <= 0.01) {
                this.moveTo = false;
            }
        }
    }

}

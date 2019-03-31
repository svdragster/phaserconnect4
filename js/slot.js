export default class Slot extends Phaser.GameObjects.Zone {

    constructor(scene, x, y, width, height) {
        super(scene, x, y, width, height);
        this.scene = scene;
        this.empty = true;
        this.coin  = null;

        this.scene.add.existing(this);
        this.setInteractive();

        var graphics = this.scene.graphics;
        graphics.lineStyle(2, 0xff0000 + Math.random()*0x00ffff);
        graphics.strokeRect(this.x - this.input.hitArea.width / 2, this.y - this.input.hitArea.height / 2, this.input.hitArea.width, this.input.hitArea.height);
    }

    fill(coin) {
        this.empty = false;
        this.coin  = coin;
    }

}

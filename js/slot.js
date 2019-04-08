import Coin from "./coin.js";
import {firebaseManager} from "./index.js";

export default class Slot extends Phaser.GameObjects.Zone {

    constructor(scene, x, y, width, height) {
        super(scene, x, y, width, height);
        this.scene = scene;
        this.empty = true;
        this.coin  = null;

        this.scene.add.existing(this);
        this.setInteractive();

        var graphics = this.scene.graphics;
        graphics.lineStyle(2, 0xFF8888 + Math.random() * 0x005555);
        graphics.strokeRect(this.x - this.input.hitArea.width / 2, this.y - this.input.hitArea.height / 2, this.input.hitArea.width, this.input.hitArea.height);

        let slot = this;
        var ref = firebaseManager.db.ref("game/slots/" + x + "/" + y);
        ref.on('value', function(snapshot) {
            var val = snapshot.val();
            if (val == null) return;
            if (val.empty) return;
            slot.empty = false;
            slot.coin  = new Coin(scene, val.x, val.y, val.color);

            if (val.color == "red") {
                scene.playerRed.activeCoin.clearWaypoints();
                scene.playerRed.activeCoin.x = 0;
                scene.playerRed.activeCoin.y = 0;
            } else {
                scene.playerBlue.activeCoin.clearWaypoints();
                scene.playerBlue.activeCoin.x = 0;
                scene.playerBlue.activeCoin.y = 0;
            }
            scene.slotcontainer.checkWin();
        });
    }

    fill(coin) {
        this.empty = false;
        this.coin  = coin;

        firebaseManager.db.ref("game/slots/" + this.x + "/" + this.y).set(this.toFirebase());
    }

    toFirebase() {
        return {
            x: this.x,
            y: this.y,
            empty: this.empty,
            color: this.coin == null ? null : this.coin.color
        };
    }



}

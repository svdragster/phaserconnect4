import Player from "./player.js";

export default class GameScene extends Phaser.Scene {
    preload() {
        this.load.image("red", "../assets/red.png");
        this.load.image("blue", "../assets/blue.png");
    }

    create() {
        this.text = this.add.text(16, 16, "Connect 4", {
            font: "18px monospace",
            fill: "#000000",
            padding: { x: 20, y: 10 },
            backgroundColor: "#ffffff"
        })
        .setScrollFactor(0);

        this.createZones(50, 300, 50, 300, 7);
        this.createPlayers();
    }

    createPlayers() {
        this.playerRed  = this.createPlayer("red")
        this.playerBlue = this.createPlayer("blue")

        this.currentPlayer = Math.random() >= 0.5 ? this.playerRed : this.playerBlue
        this.updateText();
    }

    createPlayer(color) {
        return new Player(this, 50, 50, color);
    }

    updateText() {
        this.text.text = "Spieler " + this.currentPlayer.getColor() + " ist am Zug";
        this.text.updateText();
    }

    update(time, delta) {

    }

    createZones(startX, startY, width, height, amount) {
        this.zones = Array();
        var graphics = this.add.graphics();
        var scene = this;
        for (var i=0; i<amount; i++) {
            let x = startX + i * (width+5);
            let y = startY;
            let zoneIndex = i;
            var zone = this.add.zone(x, y, width, height).setInteractive()
            zone.on('pointermove', function (pointer) {
                scene.currentPlayer.move(x, y - height/2 - 35)
                console.log(zoneIndex)
            });
            zone.on('pointerout', function (pointer) {

            });

            graphics.lineStyle(2, 0xffaa00 + (zoneIndex*30));
            graphics.strokeRect(zone.x - zone.input.hitArea.width / 2, zone.y - zone.input.hitArea.height / 2, zone.input.hitArea.width, zone.input.hitArea.height);
        }
    }

}

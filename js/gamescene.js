import Player from "./player.js";
import Slotcontainer from "./slotcontainer.js";
import Slot from "./slot.js";


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

        this.createSlots(
            50,   // startX
            300,  // startY
            7,    // width
            6     // height
        );
        this.createPlayers();
    }

    createPlayers() {
        this.playerRed  = this.createPlayer("red")
        this.playerBlue = this.createPlayer("blue")

        this.currentPlayer = Math.random() >= 0.5 ? this.playerRed : this.playerBlue
        this.currentPlayer.locked = false;
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

    createSlots(startX, startY, colAmount, rowAmount) {
        this.graphics = this.add.graphics();
        var scene = this;
        var startX = 200;
        var startY = 200;
        var slotSize = 50;
        this.slotcontainer = new Slotcontainer(this, startX, startY, colAmount, rowAmount);
        for (var x=0; x<colAmount; x++) {
            for (var y=0; y<rowAmount; y++) {
                this.slotcontainer.addSlot(x, y, slotSize, slotSize);
            }
        }

        /*this.zones = Array();

        for (var i=0; i<amount; i++) {
            let x = startX + i * (width+5);
            let y = startY;
            let zoneIndex = i;
            let slot = new Slot(scene, x, y, width, height);



        }*/
    }

    otherPlayersTurn() {
        if (this.currentPlayer == this.playerRed) {
            this.currentPlayer = this.playerBlue;
        } else {
            this.currentPlayer = this.playerRed;
        }
        this.currentPlayer.locked = false;
        this.currentPlayer.addCoin(this.cameras.main.centerX, 0);
        this.updateText()
    }

}

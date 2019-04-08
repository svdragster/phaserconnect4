import Player from "./player.js";
import Slotcontainer from "./slotcontainer.js";
import Slot from "./slot.js";
import {firebaseManager} from "./index.js";


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
        this.colorText = this.add.text(16, 64, "Farbe noch unbekannt", {
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
        let scene       = this;
        this.playerRed  = this.createPlayer("red");
        this.playerBlue = this.createPlayer("blue");
        this.assignThisPlayer();

        if (this.thisPlayer == this.playerRed) {
            this.currentPlayer = Math.random() >= 0.5 ? this.playerRed : this.playerBlue
            this.updateFirebaseCurrentPlayer();
        }
        firebaseManager.db.ref("game/currentPlayer").on('value', function(snap) {
            var val = snap.val();
            var color = val.color;
            var x     = val.x;
            var y     = val.y;
            if (color == "red") {
                scene.currentPlayer = scene.playerRed;
            } else {
                scene.currentPlayer = scene.playerBlue;
            }
            scene.currentPlayer.locked = false;
            if (scene.currentPlayer != scene.thisPlayer) {
                scene.currentPlayer.moveCoin(x, y);
            }
            scene.updateText();
        })

    }

    updateFirebaseCurrentPlayer(force) {
        if (this.currentPlayer == this.thisPlayer || force) {
            console.log(this.currentPlayer.activeCoin.x, this.currentPlayer.activeCoin.y)
            firebaseManager.setCurrentPlayer({
                color: this.currentPlayer.color,
                x: this.currentPlayer.activeCoin.x,
                y: this.currentPlayer.activeCoin.y
            });
        }
    }

    assignThisPlayer() {
        let scene = this;
        firebaseManager.getNextPlayer(function(nextPlayer) {
            console.log("nextPlayer: " + nextPlayer);
            if (nextPlayer == "red") {
                scene.assignPlayer(scene.playerRed);
            } else {
                scene.assignPlayer(scene.playerBlue);
            }
        });
    }

    assignPlayer(player) {
        this.thisPlayer = player;
        this.colorText.text = "You are " + player.color + "!";
        this.colorText.updateText();
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

        firebaseManager.writeSlots(this.slotcontainer.toFirebase());

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
            this.otherPlayer   = this.playerRed;
        } else {
            this.currentPlayer = this.playerRed;
            this.otherPlayer   = this.playerBlue;
        }
        this.currentPlayer.locked = false;
        if (this.thisPlayer == this.currentPlayer) {
            this.currentPlayer.addCoin(this.cameras.main.centerX, 0);
        }
        this.updateText()
        this.updateFirebaseCurrentPlayer(true);
    }

}

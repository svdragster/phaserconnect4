import Slot from "./slot.js";

export default class Slotcontainer {

    DirectionsEnum = Object.freeze({
        "n": [0, -1], "e": [1, 0], "s": [0, 1], "w": [-1, 0],
        "ne": [1, -1], "se": [1, 1], "sw": [-1, 1], "nw": [-1, -1]
    });

    constructor(scene, startX, startY, width, height) {
        this.scene = scene;
        this.startX = startX;
        this.startY = startY;
        this.width  = width;
        this.height = height;
        this.slots  = this.createArrays(width, height);
        this.firebaseSlots = this.createArrays(width, height);
    }

    createArrays(width, height) {
        for (var slots=[]; slots.push([height])<width;);
        return slots;
    }

    arrayXtoScreenX(arrayX, width) {
        return arrayX*width  + this.startX;
    }

    arrayYtoScreenY(arrayY, height) {
        return arrayY*height  + this.startY;
    }

    addSlot(arrayX, arrayY, width, height) {
        var container = this;
        var x = this.arrayXtoScreenX(arrayX, width);
        var y = this.arrayYtoScreenY(arrayY, height);
        let slot = new Slot(this.scene, x, y, width, height);
        this.slots[arrayX][arrayY] = slot;
        slot.on('pointermove', function (pointer) {
            if (this.scene.currentPlayer == this.scene.thisPlayer) {
                this.scene.currentPlayer.moveCoin(x, container.startY - height - 20);
            }
        });
        slot.on('pointerout', function (pointer) {

        });
        slot.on('pointerdown', function (pointer) {
            if (this.scene.currentPlayer == this.scene.thisPlayer) {
                container.dropCoin(arrayX, height);
            }
        });
    }

    dropCoin(arrayX, slotHeight) {
        var player = this.scene.currentPlayer;
        var highestSlot = this.getHighestSlot(arrayX);
        if (highestSlot.empty) {
            highestSlot.fill(player.activeCoin);
            player.moveCoin(highestSlot.x, highestSlot.y);
            player.locked = true;

            this.checkWin();

            this.scene.otherPlayersTurn()
        } else {
            player.addWaypoint(highestSlot.x, highestSlot.y - slotHeight, 0.5);
            player.addWaypoint(highestSlot.x, highestSlot.y - slotHeight - 20, 0.3);
        }
    }

    getHighestSlot(arrayX) {
        var column = this.slots[arrayX];
        var slot;
        for (var y=column.length-1; y>=0; y--) {
            slot = column[y];
            if (slot.empty) {
                break;
            }
        }
        return slot;
    }

    checkWin() {
        var scene     = this.scene;
        var container = this;
        for (var x=0; x<this.width; x++) {
            for (var y=0; y<this.height; y++) {
                let win = false;
                let directions = this.DirectionsEnum;
                Object.keys(directions).forEach(function(key) {
                    var direction = directions[key];
                    if (container.hasEnoughCoins(scene.playerRed,  x, y, direction[0], direction[1])) {
                        win = true;
                        return;
                    }
                    if (container.hasEnoughCoins(scene.playerBlue, x, y, direction[0], direction[1])) {
                        win = true;
                        return;
                    }
                });
                if (win) {
                    //return;
                }
            }
        }
    }

    hasEnoughCoins(player, x, y, directionX, directionY) {
        var slots = Array();
        this.findAnotherCoinInDirection(player, x, y, directionX, directionY, slots);
        if (slots.length >= 4) {
            console.log("=====================");
            console.log("WIIIIIIIIIIN ");
            console.log(player.color);
            console.log(slots);
            var flashAdd = 0;
            slots.forEach(function(obj) {
                obj.coin.flash = true;
                obj.coin.flashColor = flashAdd;
                flashAdd += 40;
            });
            console.log("=====================");
            return true;
        }
        return false;
    }

    findAnotherCoinInDirection(player, x, y, directionX, directionY, recursionSlots) {
        if (recursionSlots.length >= 4) {

            return;
        }
        if (x < 0 || x >= this.width
            || y < 0 || y >= this.height) {
            return;
        }
        var color  = player.color;
        var newSlot = this.slots[x][y];
        //console.log(x + ", " + y + ", " + newSlot);
        if (newSlot.coin == null) {
            return;
        }
        //console.log(player.color + " -> " + x + ", " + y + "    " + newSlot.coin.color + "    recursion " + recursionLevel);
        if (newSlot.coin.color != color) {
            return;
        }
        recursionSlots.push(newSlot);
        var newX = x + directionX;
        var newY = y + directionY;
        // recursion
        this.findAnotherCoinInDirection(player, newX, newY, directionX, directionY, recursionSlots);
    }

    toFirebase() {
        for (var x=0; x<this.width; x++) {
            for (var y=0; y<this.height; y++) {
                var data = this.slots[x][y].toFirebase();
                this.firebaseSlots[x][y] = data;
            }
        }
        return this.firebaseSlots;
    }

}

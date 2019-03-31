import Slot from "./slot.js";

export default class Slotcontainer {

    constructor(scene, startX, startY, width, height) {
        this.scene = scene;
        this.startX = startX;
        this.startY = startY;
        for (var slots=[]; slots.push([height])<width;);
        this.slots = slots;
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
            this.scene.currentPlayer.moveCoin(x, container.startY - height - 5);
        });
        slot.on('pointerout', function (pointer) {

        });
        slot.on('pointerdown', function (pointer) {
            console.log(arrayX, arrayY);
            container.dropCoin(arrayX);
        });
    }

    dropCoin(arrayX) {
        var highestSlot = this.getHighestSlot(arrayX);
        highestSlot.fill(null);
        console.log(highestSlot);
        this.scene.currentPlayer.moveCoin(highestSlot.x, highestSlot.y);
        this.scene.currentPlayer.locked = true;
        this.scene.otherPlayersTurn()
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

}

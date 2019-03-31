import Slot from "./slot.js";

export default class Slotcontainer {

    constructor(scene, startX, startY, width, height) {
        this.scene = scene;
        this.startX = startX;
        this.startY = startY;
        for (var slots=[]; slots.push([height])<width;);
        this.slots = slots;
    }

    addSlot(arrayX, arrayY, width, height) {
        var container = this;
        var x = arrayX*width  + this.startX;
        var y = arrayY*height + this.startY;
        let slot = new Slot(this.scene, x, y, width, height);
        this.slots[arrayX][arrayY] = slot;
        slot.on('pointermove', function (pointer) {
            this.scene.currentPlayer.move(x, container.startY - height - 5);
        });
        slot.on('pointerout', function (pointer) {
            container.dropCoin(arrayY);
        });
        slot.on('pointerdown', function (pointer) {
            console.log(arrayX, arrayY);
        });
    }

    dropCoin(arrayY) {
        
    }

}

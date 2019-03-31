class Waypoint {
    constructor(x, y, speed) {
        this.x = x;
        this.y = y;
        this.speed = speed;
    }
}

export default class Coin extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture, null);
        this.scene  = scene;
        this.waypoints = Array();
        this.moveTo = false;
        this.color  = texture;
        this.flash  = false;
        this.flashColor = 0;
        this.flashDir   = 1;

        this.scene.add.existing(this);
    }

    addWaypoint(x, y, speed) {
        for (var i=0; i<this.waypoints.length; i++) {
            var waypoint = this.waypoints[i];
            if (waypoint.x == x && waypoint.y == y) {
                return;
            }
        }
        this.waypoints.push(new Waypoint(x, y, speed))
        this.moveTo = true;
    }

    move(x, y) {
        this.waypoints = Array();
        this.waypoints.push(new Waypoint(x, y, 0.3))
        this.moveTo = true;
    }

    preUpdate(time, delta) {
        if (this.moveTo) {
            var waypoint = this.waypoints[0];
            this.x += (waypoint.x - this.x)*waypoint.speed;
            this.y += (waypoint.y - this.y)*waypoint.speed;
            var distanceX = Math.abs(waypoint.x - this.x);
            var distanceY = Math.abs(waypoint.y - this.y);
            if (distanceX <= 1 && distanceY <= 1) {
                this.waypoints.shift();
                if (this.waypoints.length == 0) {
                    this.moveTo = false;
                }
            }
        }
        if (this.flash) {
            this.flashColor += 10 * this.flashDir;
            if (this.flashColor > 255) {
                this.flashColor = 255;
                this.flashDir *= -1;
            } else if (this.flashColor < 50) {
                this.flashColor = 50;
                this.flashDir *= -1;
            }
            this.setTint(Phaser.Display.Color.GetColor(this.flashColor, this.flashColor, this.flashColor));
        }
    }

}

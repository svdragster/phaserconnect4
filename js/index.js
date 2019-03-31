import GameScene from "./gamescene.js";
import FirebaseManager from "./firebaseManager.js";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "game-container",
  pixelArt: true,
  backgroundColor: "#1d212d",
  scene: GameScene,
  //pixelArt: true,
  physics: {
    default: "arcade",
  }
};

export let firebaseManager = new FirebaseManager();
const game = new Phaser.Game(config);

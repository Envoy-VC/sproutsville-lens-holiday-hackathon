export const preloadAudio = (scene: Phaser.Scene) => {
  scene.load.audio('soundtrack', '/assets/soundtrack.mp3');
  scene.load.audio('teleport', '/assets/sounds/teleport.wav');
};

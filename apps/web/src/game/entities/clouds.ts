import Phaser from 'phaser';

export class CloudsOverlay {
  animateClouds(scene: Phaser.Scene) {
    const numClouds = 200;
    const screenWidth = scene.cameras.main.width;
    const screenHeight = scene.cameras.main.height;

    for (let i = 0; i < numClouds; i++) {
      // Random cloud image (Cloud1.png to Cloud20.png)
      const cloudIndex = Phaser.Math.Between(1, 20);

      const startX = Phaser.Math.Between(-500, -300);
      const startY = Phaser.Math.Between(
        (screenHeight / numClouds) * i,
        (screenHeight / numClouds) * (i + 3)
      );
      const randomScale = Phaser.Math.FloatBetween(3, 3.5);

      // Add cloud sprite at the left side, just off-screen
      const cloud = scene.add
        .sprite(startX, startY, `Cloud${cloudIndex}`)
        .setScale(randomScale)
        .setAlpha(Phaser.Math.FloatBetween(0.6, 1))
        .setDepth(100) // Clouds should be above the player
        .setOrigin(0, 0) // Top-left origin
        .setScrollFactor(0); // Clouds are fixed in screen space

      const parallaxSpeed = Phaser.Math.FloatBetween(0.4, 0.8);
      const midX = Phaser.Math.Between(100, screenWidth - 100);

      // Tween cloud from left to cover the screen
      scene.tweens.add({
        targets: cloud,
        x: midX,
        duration: 3000 * parallaxSpeed,
        ease: 'Sine.easeInOut',
        onComplete: () => {
          const endX = screenWidth + 500;
          scene.time.delayedCall(2000, () => {
            scene.tweens.add({
              targets: cloud,
              x: endX,
              duration: 3000,
              ease: 'Sine.easeInOut',
            });
          });
        },
      });

      // Optional: Drift clouds slightly up/down for added natural movement
      scene.tweens.add({
        targets: cloud,
        y: startY + Phaser.Math.Between(-50, 50), // Random vertical drift
        duration: 3000 * parallaxSpeed, // Vertical drift speed
        yoyo: true, // Move back and forth
        repeat: -1, // Repeat indefinitely
        ease: 'Sine.easeInOut',
      });
    }
  }
}

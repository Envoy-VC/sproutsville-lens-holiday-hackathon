import Phaser from 'phaser';

export interface CursorKeys {
  up: Phaser.Input.Keyboard.Key;
  left: Phaser.Input.Keyboard.Key;
  down: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
}

export const createCursorKeys = (
  keyboard: Phaser.Input.Keyboard.KeyboardPlugin
) => {
  return keyboard.addKeys({
    up: Phaser.Input.Keyboard.KeyCodes.W,
    left: Phaser.Input.Keyboard.KeyCodes.A,
    down: Phaser.Input.Keyboard.KeyCodes.S,
    right: Phaser.Input.Keyboard.KeyCodes.D,
  }) as {
    up: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  };
};

export const createAnimations = (scene: Phaser.Scene, key: string) => {
  const framesPerRow = 13;
  const directions = [
    {
      key: 'north',
      rowIndex: 8,
    },
    {
      key: 'west',
      rowIndex: 9,
    },
    {
      key: 'south',
      rowIndex: 10,
    },
    {
      key: 'east',
      rowIndex: 11,
    },
  ];
  directions.forEach((direction) => {
    scene.anims.create({
      key: `walk-${direction.key}`,
      frames: scene.anims.generateFrameNumbers(key, {
        start: direction.rowIndex * framesPerRow,
        end: direction.rowIndex * framesPerRow + 8,
      }),
      frameRate: 9,
      repeat: -1,
    });
  });

  directions.forEach((direction) => {
    scene.anims.create({
      key: `idle-${direction.key}`,
      frames: scene.anims.generateFrameNumbers(key, {
        start: direction.rowIndex * framesPerRow,
        end: direction.rowIndex * framesPerRow,
      }),
      frameRate: 10,
      repeat: -1,
    });
  });
};

export const registerMovement = (
  cursors: CursorKeys,
  speed: number,
  sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
) => {
  const { left, right, up, down } = cursors;

  // Reset velocity
  let velocityX = 0;
  let velocityY = 0;
  let animationKey = '';

  // Check input for movement
  if (left.isDown) {
    velocityX = -speed;
    animationKey = 'walk-west';
  } else if (right.isDown) {
    velocityX = speed;
    animationKey = 'walk-east';
  } else if (up.isDown) {
    velocityY = -speed;
    animationKey = 'walk-north';
  } else if (down.isDown) {
    velocityY = speed;
    animationKey = 'walk-south';
  }

  sprite.body.setVelocity(velocityX, velocityY);

  if (velocityX !== 0 || velocityY !== 0) {
    sprite.anims.play(animationKey, true);
  } else {
    // Set idle animation based on last played direction
    const currentAnimation = sprite.anims.currentAnim?.key;
    if (currentAnimation) {
      const idleKey = currentAnimation.replace('walk', 'idle');
      sprite.anims.play(idleKey, true);
    }
  }
};

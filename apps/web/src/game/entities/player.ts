import { registerMovement } from '../helpers/movement';

import { UpdateProps } from '~/types/game';

interface CreatePlayerProps {
  x: number;
  y: number;
  speed: number;
  sprite: string;
}

export class Player {
  public sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  public speed: number;

  constructor({ x, y, sprite, speed }: CreatePlayerProps, scene: Phaser.Scene) {
    this.sprite = scene.physics.add
      .sprite(x, y, sprite)
      .setScale(1.3)
      .setDepth(1)
      .setBodySize(32, 42)
      .setOffset(16, 24);

    this.sprite.setCollideWorldBounds(true);
    this.speed = speed;
  }

  update({ scene }: UpdateProps) {
    registerMovement(scene.cursors, this.speed, this.sprite);
  }
}

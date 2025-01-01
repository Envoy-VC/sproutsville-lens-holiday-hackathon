import { playerEmitter } from '../event-emitter';
import { registerMovement } from '../helpers/movement';
import { CloudsOverlay } from './clouds';

import { CreatePlayerProps, TeleportProps, UpdateProps } from '~/types/game';

export class Player {
  public scene: TeleportProps['scene'];
  public sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  public speed: number;
  public cloudsOverlay: CloudsOverlay;

  constructor({ x, y, sprite, speed, scene }: CreatePlayerProps) {
    this.sprite = scene.physics.add
      .sprite(x, y, sprite)
      .setScale(1.3)
      .setDepth(1)
      .setBodySize(32, 42)
      .setOffset(16, 24);

    this.sprite.setCollideWorldBounds(true);
    this.speed = speed;
    this.scene = scene;
    this.cloudsOverlay = new CloudsOverlay();

    // on map click, log world coordinates in tiles
    scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      const worldPoint = scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
      const tileX = Math.floor(worldPoint.x / 16);
      const tileY = Math.floor(worldPoint.y / 16);
      console.log(`Tile X: ${tileX}, Tile Y: ${tileY}`);
    });

    playerEmitter.on('teleport', (props) => {
      this.cloudsOverlay.animateClouds(this.scene);
      // after 4 seconds, teleport the player
      setTimeout(() => {
        this.teleport({ ...props, scene: this.scene });
      }, 2000);
    });
  }

  teleport({ tileX, tileY, scene }: TeleportProps) {
    const targetX = scene.map.tileToWorldX(tileX);
    const targetY = scene.map.tileToWorldY(tileY);

    if (!targetX || !targetY) return;

    this.sprite.setPosition(
      targetX + scene.map.tileWidth / 2,
      targetY + scene.map.tileHeight / 2
    );
  }

  update({ scene }: UpdateProps) {
    registerMovement(scene.cursors, this.speed, this.sprite);
  }
}

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
      console.log({
        worldX: pointer.worldX,
        worldY: pointer.worldY,
        x: pointer.x,
        y: pointer.y,
      });

      const tileX = Math.floor(pointer.worldX / 16);
      const tileY = Math.floor(pointer.worldY / 16);
      console.log(`Tile X: ${tileX}, Tile Y: ${tileY}`);
      const targetX = scene.map.tileToWorldX(tileX, scene.cameras.main);
      const targetY = scene.map.tileToWorldY(tileY, scene.cameras.main);

      console.log(`Target X: ${targetX}, Target Y: ${targetY}`);
    });

    playerEmitter.on('teleport', (props) => {
      this.cloudsOverlay.animateClouds(this.scene);
      // after 4 seconds, teleport the player
      setTimeout(() => {
        this.teleport({ ...props, scene: this.scene });
      }, 2000);
    });
  }

  teleport({ tileX, tileY }: TeleportProps) {
    const targetX = tileX * 16;
    const targetY = tileY * 16;
    if (!targetX || !targetY) return;
    this.sprite.setPosition(targetX, targetY);
  }

  update({ scene }: UpdateProps) {
    registerMovement(scene.cursors, this.speed, this.sprite);
  }
}

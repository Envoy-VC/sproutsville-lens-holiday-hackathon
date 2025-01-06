/* eslint-disable @typescript-eslint/no-non-null-assertion -- safe */
import type Phaser from 'phaser';

import { type NPCAbstract } from '../classes/npc';

import type { CreatePlayerProps, UpdateProps } from '~/types/game';

export class Farmer implements NPCAbstract {
  public key: string;
  public scene: CreatePlayerProps['scene'];
  public sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  public speed: number;
  public currentDirection: string;
  public isMoving: boolean;

  constructor({ x, y, sprite, speed, scene }: CreatePlayerProps) {
    this.sprite = scene.physics.add
      .sprite(x, y, sprite)
      .setScale(1.3)
      .setDepth(9)
      .setBodySize(32, 42)
      .setOffset(16, 24);

    this.sprite.setCollideWorldBounds(true);
    this.speed = speed;
    this.scene = scene;
    this.currentDirection = 'south';
    this.key = sprite;
    this.isMoving = false;

    // scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
    //   const worldPoint = scene.cameras.main.getWorldPoint(pointer.x, pointer.y);

    //   const tileX = Math.floor(worldPoint.x / 16);
    //   const tileY = Math.floor(worldPoint.y / 16);
    //   void this.moveTo(tileX, tileY, 16);
    // });
  }

  async moveTo(tileX: number, tileY: number, tileSize: number) {
    if (this.isMoving) return;
    const currentTileX = Math.floor(this.sprite.x / tileSize);
    const currentTileY = Math.floor(this.sprite.y / tileSize);

    const path = this.scene.pathfinder.findPath(
      currentTileX,
      currentTileY,
      tileX,
      tileY
    );

    if (path.length > 1) {
      this.isMoving = true;
      for (const [nextTileX, nextTileY] of path) {
        const targetX = nextTileX! * tileSize + tileSize / 2;
        const targetY = nextTileY! * tileSize + tileSize / 2;

        this.setDirection(targetX, targetY);

        await this.moveStep(targetX, targetY);
      }
    }
    this.isMoving = false;
    this.sprite.play(`${this.key}-idle-${this.currentDirection}`);
  }

  private moveStep(targetX: number, targetY: number): Promise<void> {
    return new Promise((resolve) => {
      const dx = targetX - this.sprite.x;
      const dy = targetY - this.sprite.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const duration = (distance / this.speed) * 1000; // Duration in milliseconds

      this.scene.tweens.add({
        targets: this.sprite,
        x: targetX,
        y: targetY,
        duration,
        onComplete: () => resolve(),
      });

      this.playAnimation(`${this.key}-walk-${this.currentDirection}`);
    });
  }

  private playAnimation(animationKey: string) {
    const currentAnimation = this.sprite.anims.getName();
    if (currentAnimation !== animationKey) {
      this.sprite.play(animationKey, true);
    }
  }

  private setDirection(targetX: number, targetY: number) {
    const dx = targetX - this.sprite.x;
    const dy = targetY - this.sprite.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      this.currentDirection = dx > 0 ? 'east' : 'west';
    } else {
      this.currentDirection = dy > 0 ? 'south' : 'north';
    }
  }

  update(_props: UpdateProps) {
    this.sprite.setVelocity(0, 0);
  }
}

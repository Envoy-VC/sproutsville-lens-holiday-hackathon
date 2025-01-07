/* eslint-disable @typescript-eslint/no-non-null-assertion -- safe */
import Phaser from 'phaser';

import { type NPCAbstract } from '../classes/npc';
import { taskManagerEmitter } from '../event-emitter';
import { getRandomTileNear } from '../helpers/movement';

import type { CreateNPCProps, UpdateProps } from '~/types/game';

export class NPC implements NPCAbstract {
  public key: string;
  public scene: CreateNPCProps['scene'];
  public sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  public speed: number;
  public currentDirection: string;
  public isMoving: boolean;

  constructor({ sprite, speed, scene, nearTo }: CreateNPCProps) {
    const tile = getRandomTileNear(
      nearTo.x,
      nearTo.y,
      nearTo.radius,
      scene.collisionLayer
    );
    if (!tile) {
      throw new Error('Could not find a suitable tile');
    }
    this.sprite = scene.physics.add
      .sprite(tile.x * 16, tile.y * 16, sprite)
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

    taskManagerEmitter.on('start-task', (task) => {
      if (task.type === 'moveToRandom' && task.entityId === this.key) {
        const random = getRandomTileNear(
          nearTo.x,
          nearTo.y,
          nearTo.radius,
          scene.collisionLayer
        );
        if (random) {
          void this.moveTo(random.x, random.y, 16).then(async () => {
            const randomWait = Phaser.Math.Between(3000, 8000);
            await new Promise((resolve) => {
              setTimeout(resolve, randomWait);
            });
            taskManagerEmitter.emit('start-task', {
              type: 'moveToRandom',
              entityId: this.key,
            });
          });
        }
      }
    });

    taskManagerEmitter.emit('start-task', {
      type: 'moveToRandom',
      entityId: this.key,
    });

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

import type Phaser from 'phaser';

import type { UpdateProps } from '~/types/game';

export abstract class NPCAbstract {
  public abstract key: string;
  public abstract scene: UpdateProps['scene'];
  public abstract sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  public abstract speed: number;
  public abstract currentDirection: string;
  public abstract isMoving: boolean;

  abstract moveTo(
    tileX: number,
    tileY: number,
    tileSize: number
  ): Promise<void>;

  abstract update(_props: UpdateProps): void;
}

import type { MusicManager } from '.';
import type { Farmer, InteractionText, Player } from '../entities';
import { type CursorKeys } from '../helpers/movement';
import type { Pathfinder } from './pathfinder';

export abstract class GameSceneAbstract extends Phaser.Scene {
  public abstract map: Phaser.Tilemaps.Tilemap;
  public abstract collisionLayer: Phaser.Tilemaps.TilemapLayer;
  public abstract interactionLayer: Phaser.Tilemaps.TilemapLayer;
  public abstract player: Player;
  public abstract farmer: Farmer;
  public abstract cursors: CursorKeys;
  public abstract musicManager: MusicManager;
  public abstract pathfinder: Pathfinder;
  public abstract interactionText: InteractionText;

  public abstract config: {
    mapSize: { x: number; y: number };
  };

  public abstract preload(): void;

  public abstract create(): void;

  public abstract update(time: number, delta: number): void;
}

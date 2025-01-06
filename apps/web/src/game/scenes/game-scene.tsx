/* eslint-disable @typescript-eslint/no-non-null-assertion -- safe */
import Phaser from 'phaser';
import Map from 'public/assets/sproutsville-main.json';

import {
  type GameSceneAbstract,
  MusicManager,
  type NPCAbstract,
  Pathfinder,
} from '../classes';
import { Farmer, InteractionText, Player } from '../entities';
import { type CursorKeys, createCursorKeys } from '../helpers/movement';
import { gameState } from '../state';

import type { GameSceneProps } from '~/types/game';

export class GameScene extends Phaser.Scene implements GameSceneAbstract {
  public map!: Phaser.Tilemaps.Tilemap;
  public collisionLayer!: Phaser.Tilemaps.TilemapLayer;
  public interactionLayer!: Phaser.Tilemaps.TilemapLayer;
  public player!: Player;
  public npcs!: NPCAbstract[];
  public cursors!: CursorKeys;
  public musicManager!: MusicManager;
  public pathfinder!: Pathfinder;
  public interactionText!: InteractionText;
  public previousModalState: boolean;

  public config: GameSceneProps['config'];

  constructor(props: GameSceneProps) {
    super({ key: 'GameScene' });
    this.config = props.config;
    this.previousModalState = false;
  }

  create() {
    const mapWidth = this.config.mapSize.x * 16;
    const mapHeight = this.config.mapSize.y * 16;
    this.cameras.main.setZoom(2);
    const zoom = this.cameras.main.zoom;
    this.cameras.main.roundPixels = true;
    this.cameras.main.setBounds(
      0,
      0,
      this.config.mapSize.x * 16 * zoom,
      this.config.mapSize.y * 16 * zoom
    );

    const map = this.make.tilemap({
      key: 'world',
      tileHeight: 16,
      tileWidth: 16,
    });

    this.map = map;

    const tilesets = Map.tilesets.map((tileset) => {
      return map.addTilesetImage(tileset.name, tileset.name)!;
    });

    map.layers.forEach((layer) => {
      if (layer.name === 'Collision') {
        this.collisionLayer = map
          .createLayer(layer.name, tilesets, 0, 0)!
          .setScale(zoom)
          .setAlpha(0);
      } else if (layer.name === 'Interaction') {
        this.interactionLayer = map
          .createLayer(layer.name, tilesets, 0, 0)!
          .setScale(zoom)
          .setAlpha(0);
      } else if (layer.name.includes('Trees')) {
        map
          .createLayer(layer.name, tilesets, 0, 0)!
          .setScale(zoom)
          .setDepth(10);
      } else {
        map.createLayer(layer.name, tilesets, 0, 0)!.setScale(zoom).setDepth(0);
      }
    });

    const data = this.scene.settings.data as {
      playerPosition?: { x: number; y: number };
    };

    console.log(data);

    this.player = new Player({
      x: data.playerPosition?.x ?? this.config.playerPosition.x,
      y: data.playerPosition?.y ?? this.config.playerPosition.y,
      sprite: 'trader',
      speed: 50,
      scene: this,
    });

    this.npcs = [];
    this.npcs.push(
      new Farmer({
        x: 100,
        y: 1650,
        sprite: 'farmer',
        speed: 50,
        scene: this,
      })
    );

    this.npcs.forEach((npc) => {
      this.physics.add.collider(this.player.sprite, npc.sprite);
    });

    // Set Collision with World Bounds and Collision Layer
    this.physics.world.setBounds(0, 0, mapWidth * zoom, mapHeight * zoom);
    this.collisionLayer.setCollisionByProperty({ collides: true });
    this.physics.add.collider(this.player.sprite, this.collisionLayer);

    // Set Collision with Interaction Layer
    this.physics.add.collider(this.player.sprite, this.interactionLayer);

    // Create Cursor Keys
    this.cursors = createCursorKeys(this.input.keyboard!);

    // Set Camera to Follow Player
    this.cameras.main.startFollow(this.player.sprite);

    // Set Music Manager
    this.musicManager = new MusicManager(this);

    // Set Pathfinder
    this.pathfinder = new Pathfinder(this.collisionLayer);

    // Set Interaction Text
    this.interactionText = new InteractionText(this);
  }

  update(time: number, delta: number) {
    this.player.update({ scene: this, time, delta });
    this.npcs.forEach((npc) => {
      npc.update({ scene: this, time, delta });
    });

    this.interactionText.update({ scene: this, time, delta });

    if (gameState.isInteractionModalOpen !== this.previousModalState) {
      this.previousModalState = gameState.isInteractionModalOpen;

      if (gameState.isInteractionModalOpen) {
        // Disable keyboard input when the modal is open
        this.input.keyboard?.disableGlobalCapture();
      } else {
        // Enable keyboard input when the modal is closed
        this.input.keyboard?.enableGlobalCapture();
      }
    }
  }

  shutdown() {
    this.input.keyboard?.removeAllListeners(); // Remove all keyboard listeners
    this.physics.world.shutdown(); // Stop physics
    this.children.removeAll();
  }
}

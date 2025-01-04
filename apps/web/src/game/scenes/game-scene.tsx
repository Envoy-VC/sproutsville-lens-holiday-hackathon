/* eslint-disable @typescript-eslint/no-non-null-assertion -- safe */
import Phaser from 'phaser';
import Map from 'public/assets/sproutsville-main.json';

import { MusicManager, Pathfinder } from '../classes';
import { Farmer, InteractionText, Player } from '../entities';
import { preloadAudio } from '../helpers/audio';
import { type CursorKeys, createCursorKeys } from '../helpers/movement';
import { gameState } from '../state';

interface GameSceneProps {
  config: {
    mapSize: { x: number; y: number };
  };
}

export class GameScene extends Phaser.Scene {
  public map!: Phaser.Tilemaps.Tilemap;
  public collisionLayer!: Phaser.Tilemaps.TilemapLayer;
  public interactionLayer!: Phaser.Tilemaps.TilemapLayer;
  public player!: Player;
  public farmer!: Farmer;
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

  preload() {
    const spriteSheets = ['elf', 'farmer', 'trader'];
    Map.tilesets.forEach((tileset) => {
      this.load.image(tileset.name, `assets/${tileset.image}`);
    });

    this.load.tilemapTiledJSON('world', 'assets/sproutsville-main.json');

    spriteSheets.forEach((spriteSheet) => {
      this.load.spritesheet(spriteSheet, `assets/sprites/${spriteSheet}.png`, {
        frameWidth: 64,
        frameHeight: 64,
      });
    });

    for (let i = 1; i <= 20; i++) {
      this.load.image(
        `Cloud${String(i)}`,
        `assets/tileset/clouds/Cloud ${String(i)}.png`
      );
    }
    preloadAudio(this);
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
        map.createLayer(layer.name, tilesets, 0, 0)!.setScale(zoom).setDepth(2);
      } else {
        map.createLayer(layer.name, tilesets, 0, 0)!.setScale(zoom).setDepth(0);
      }
    });

    this.player = new Player({
      x: 50,
      y: 1650,
      sprite: 'trader',
      speed: 50,
      scene: this,
    });
    this.farmer = new Farmer({
      x: 100,
      y: 1650,
      sprite: 'farmer',
      speed: 50,
      scene: this,
    });

    this.physics.add.collider(this.player.sprite, this.farmer.sprite);

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
    this.musicManager.playSoundtrack();

    // Set Pathfinder
    this.pathfinder = new Pathfinder(this.collisionLayer);

    // Set Interaction Text
    this.interactionText = new InteractionText(this);
  }

  update(time: number, delta: number) {
    this.player.update({ scene: this, time, delta });
    this.farmer.update({ scene: this, time, delta });
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
}

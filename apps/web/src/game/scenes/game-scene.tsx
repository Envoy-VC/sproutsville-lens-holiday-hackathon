/* eslint-disable @typescript-eslint/no-non-null-assertion -- safe */
import Phaser from 'phaser';
import Map from 'public/assets/sproutsville-main.json';

import { Minimap, Player } from '../entities';
import {
  type CursorKeys,
  createAnimations,
  createCursorKeys,
} from '../helpers/movement';

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
  public cursors!: CursorKeys;
  public minimap!: Minimap;

  public config: GameSceneProps['config'];

  constructor(props: GameSceneProps) {
    super({ key: 'GameScene' });
    this.config = props.config;
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
      this.load.image(`Cloud${i}`, `assets/tileset/clouds/Cloud ${i}.png`);
    }
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
        return;
      } else if (layer.name === 'Interaction') {
        this.interactionLayer = map
          .createLayer(layer.name, tilesets, 0, 0)!
          .setScale(zoom)
          .setAlpha(0);
        return;
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
    createAnimations(this, 'trader');

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

    // Create Minimap
    this.minimap = new Minimap({
      scene: this,
      map,
      toFollow: this.player.sprite,
      zoom: 0.25,
    });

    this.cameras.main.ignore(this.minimap.playerPointer);
    const minimapWidth = 300;
    const minimapHeight = 150;
    const minimapX = 715;
    const minimapY = 10;
    const blackFrame = this.add.graphics({
      x: minimapX - 4,
      y: minimapY - 4,
    });
    blackFrame.fillStyle(0x000000, 1);

    blackFrame.fillRect(
      minimapX - 4,
      minimapY - 4,
      minimapWidth + 8,
      minimapHeight + 8
    );

    blackFrame.setDepth(3);
  }

  update(time: number, delta: number) {
    this.player.update({ scene: this, time, delta });
    this.minimap.update({ scene: this, time, delta });
  }
}

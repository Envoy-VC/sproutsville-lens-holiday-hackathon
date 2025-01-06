/* eslint-disable @typescript-eslint/no-non-null-assertion -- safe */
import Phaser from 'phaser';
import Map from 'public/assets/sproutsville-player-village.json';

import { type GameSceneAbstract, MusicManager, Pathfinder } from '../classes';
import { type NPCAbstract } from '../classes/npc';
import { InteractionText, Player } from '../entities';
import { playerEmitter } from '../event-emitter';
import { Tile } from '../helpers/constants';
import { type CursorKeys, createCursorKeys } from '../helpers/movement';
import { gameState } from '../state';

import { type CropType } from '~/types/farming';
import type { GameSceneProps } from '~/types/game';

export class PlayerVillageScene
  extends Phaser.Scene
  implements GameSceneAbstract
{
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
  public cropLayerBase!: Phaser.Tilemaps.TilemapLayer;
  public cropLayerTop!: Phaser.Tilemaps.TilemapLayer;
  public totalFarmTiles: number;
  public usedTiles: { x: number; y: number }[] = [];

  public config: GameSceneProps['config'];

  constructor(props: GameSceneProps) {
    super({ key: 'PlayerVillageScene' });
    this.config = props.config;
    this.previousModalState = false;
    this.totalFarmTiles = 0;
  }

  create() {
    const data = this.scene.settings.data as {
      playerPosition: { x: number; y: number };
    };

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
      key: 'player-world',
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

    // all tiles with 2033 in interaction layer make crop layer
    this.cropLayerBase = map
      .createBlankLayer('Crop Base', 'crops')!
      .setScale(zoom)
      .setDepth(1);
    this.cropLayerTop = map
      .createBlankLayer('Crop Top', 'crops')!
      .setScale(zoom)
      .setDepth(2);
    this.interactionLayer.forEachTile((tile) => {
      if (tile.index === 2033) {
        this.totalFarmTiles++;
        this.cropLayerTop.putTileAt(2033, tile.x, tile.y);
        this.cropLayerBase.putTileAt(2033, tile.x, tile.y);
      }
    });

    this.player = new Player({
      x: data.playerPosition.x,
      y: data.playerPosition.y,
      sprite: 'trader',
      speed: 50,
      scene: this,
    });
    this.npcs = [];

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

    playerEmitter.on('placeCrops', (props) => {
      this.plantCrops(props);
    });
  }

  plantCrops(props: { type: CropType; tiles: number }[]) {
    console.log('Planting crops', props);
    const required = props.reduce((a, b) => a + b.tiles, 0);
    if (required > this.totalFarmTiles) {
      console.log('Not enough tiles');
      return;
    }

    props.forEach((crop) => {
      const tiles = this.chooseEmptyFarmTiles(crop.tiles, this.usedTiles);
      console.log(tiles);
      tiles.forEach((tile) => {
        this.cropLayerBase.putTileAt(Tile[crop.type][0], tile.x, tile.y);
        this.cropLayerTop.putTileAt(Tile[crop.type][1], tile.x, tile.y - 1);
      });
    });
  }

  chooseEmptyFarmTiles(amount: number, used: { x: number; y: number }[]) {
    const tiles: { x: number; y: number }[] = [];
    let current = 0;
    this.cropLayerBase.forEachTile((tile) => {
      if (
        tile.index === 2033 &&
        current < amount &&
        !used.find((t) => t.x === tile.x && t.y === tile.y)
      ) {
        tiles.push({ x: tile.x, y: tile.y });
        current++;
      }
    });
    this.usedTiles = this.usedTiles.concat(tiles);
    return tiles;
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

import Phaser from 'phaser';
import MainMap from 'public/assets/sproutsville-main.json';
import PlayerMap from 'public/assets/sproutsville-player-village.json';

import { MusicManager } from '../classes';
import { preloadAudio } from '../helpers/audio';
import { createAnimations } from '../helpers/movement';

const spriteSheets = [
  'botanist',
  'farmer',
  'trader',
  'girl',
  'traveler',
  'wizard',
];

export class BootScene extends Phaser.Scene {
  public musicManager!: MusicManager;
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    MainMap.tilesets.forEach((tileset) => {
      this.load.image(tileset.name, `assets/${tileset.image}`);
    });
    PlayerMap.tilesets.forEach((tileset) => {
      this.load.image(tileset.name, `assets/${tileset.image}`);
    });

    this.load.tilemapTiledJSON('world', 'assets/sproutsville-main.json');
    this.load.tilemapTiledJSON(
      'player-world',
      'assets/sproutsville-player-village.json'
    );

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
    this.musicManager = new MusicManager(this);
    this.musicManager.playSoundtrack();
    spriteSheets.forEach((spriteSheet) => {
      createAnimations(this, spriteSheet);
    });
    this.scene.start('PlayerVillageScene', {
      playerPosition: {
        x: 50,
        y: 575,
      },
    });
    // this.scene.start('GameScene');
  }
}

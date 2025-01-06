import type Phaser from 'phaser';

import { musicEmitter } from '../event-emitter';

type SFXKeys = 'teleport';

export class MusicManager {
  private scene: Phaser.Scene;
  private soundtrack: Phaser.Sound.WebAudioSound;
  private sfx: Record<SFXKeys, Phaser.Sound.WebAudioSound>;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.soundtrack = this.scene.sound.add('soundtrack', {
      loop: true,
      volume: 0.5,
    }) as Phaser.Sound.WebAudioSound;

    this.sfx = {
      teleport: this.scene.sound.add('teleport', {
        volume: 1,
      }) as Phaser.Sound.WebAudioSound,
    };

    musicEmitter.on('set-sfx-volume', (volume) => {
      this.setSfx(volume);
    });

    musicEmitter.on('set-music-volume', (volume) => {
      this.soundtrack.setVolume(volume);
      if (volume > 0) {
        this.soundtrack.resume();
      } else {
        this.soundtrack.pause();
      }
    });
  }

  playSoundtrack() {
    if (this.soundtrack.isPlaying) {
      return;
    }
    this.soundtrack.play(undefined, { volume: 0.5 });
  }

  setSfx(volume: number) {
    Object.values(this.sfx).forEach((sfx) => {
      sfx.setVolume(volume);
    });
  }

  playSFX(key: SFXKeys) {
    this.sfx[key].play();
  }

  stopAllSFX() {
    Object.values(this.sfx).forEach((sfx) => {
      sfx.stop();
    });
  }
}

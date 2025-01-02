import Phaser from 'phaser';

type SFXKeys = 'hurt';

export class MusicManager {
  private scene: Phaser.Scene;
  private soundtrack: Phaser.Sound.BaseSound;
  private sfx: Record<SFXKeys, Phaser.Sound.BaseSound> = {};

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.soundtrack = this.scene.sound.add('soundtrack', {
      loop: true,
      volume: 0.5,
    });
    // this.sfx = {
    //   hurt: this.scene.sound.add('hurt'),
    // };
  }

  playSoundtrack() {
    this.soundtrack.play(undefined, { volume: 0.5 });
  }

  setSoundtrackVolume(volume: number) {
    if (this.soundtrack.isPlaying) {
      const marker = this.soundtrack.currentMarker;
      this.soundtrack.play(marker.name, { ...marker.config, volume });
    }
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

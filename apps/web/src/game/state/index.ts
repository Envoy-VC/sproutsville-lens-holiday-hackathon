import { makeAutoObservable } from 'mobx';

import { musicEmitter } from '../event-emitter';

export type InteractionType =
  | 'onboarding'
  | 'global-feed'
  | 'trader-house'
  | 'bank'
  | 'storage-hall'
  | 'peasant-house'
  | 'home-village-portal'
  | 'main-village-portal';

class GameState {
  public isInteractionModalOpen: boolean;
  public interactionType: InteractionType;
  public music: boolean;
  public sfx: boolean;
  public currentScene: 'main-village' | 'player-village';

  constructor() {
    makeAutoObservable(this);
    this.interactionType = 'global-feed';
    this.isInteractionModalOpen = true;
    this.music = true;
    this.sfx = true;
    this.currentScene = 'main-village';
  }

  public setInteractionModalOpen(isOpen: boolean, type: InteractionType) {
    this.interactionType = type;
    this.isInteractionModalOpen = isOpen;
  }

  public toggleMusic() {
    this.music = !this.music;
    musicEmitter.emit('set-music-volume', this.music ? 0.5 : 0);
  }

  public toggleSfx() {
    this.sfx = !this.sfx;
    musicEmitter.emit('set-sfx-volume', this.sfx ? 1 : 0);
  }

  public setCurrentScene(scene: 'main-village' | 'player-village') {
    this.currentScene = scene;
  }
}

export const gameState = new GameState();

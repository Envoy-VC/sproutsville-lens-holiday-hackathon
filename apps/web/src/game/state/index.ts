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
  | 'snowy-lands-portal';

class GameState {
  public isInteractionModalOpen: boolean;
  public interactionType: InteractionType;
  public music: boolean;
  public sfx: boolean;

  constructor() {
    makeAutoObservable(this);
    this.interactionType = 'onboarding';
    this.isInteractionModalOpen = false;
    this.music = true;
    this.sfx = true;
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
}

export const gameState = new GameState();

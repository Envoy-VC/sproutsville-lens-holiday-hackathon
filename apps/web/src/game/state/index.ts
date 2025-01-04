import { makeAutoObservable } from 'mobx';

export type InteractionType = 'onboarding' | 'peasant-house';

class GameState {
  public isInteractionModalOpen: boolean;
  public interactionType: InteractionType;
  constructor() {
    makeAutoObservable(this);
    this.interactionType = 'onboarding';
    this.isInteractionModalOpen = true;
  }

  public setInteractionModalOpen(isOpen: boolean, type: InteractionType) {
    this.interactionType = type;
    this.isInteractionModalOpen = isOpen;
  }
}

export const gameState = new GameState();

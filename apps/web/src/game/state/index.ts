import { makeAutoObservable } from 'mobx';

export type InteractionType = 'onboarding';

class GameState {
  public isInteractionModalOpen: boolean;
  public interactionType: InteractionType;
  constructor() {
    makeAutoObservable(this);
    this.interactionType = 'onboarding';
    this.isInteractionModalOpen = false;
  }

  public setInteractionModalOpen(isOpen: boolean, type: InteractionType) {
    this.interactionType = type;
    this.isInteractionModalOpen = isOpen;
  }
}

export const gameState = new GameState();

import type Phaser from 'phaser';

import { type InteractionType, gameState } from '../state';

import { type CreatePlayerProps, type UpdateProps } from '~/types/game';

export class InteractionText {
  private interactionText: Phaser.GameObjects.Text;

  constructor(scene: CreatePlayerProps['scene']) {
    this.interactionText = scene.add.text(0, 0, 'Press E to interact', {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#000000',
    });
  }

  checkInteractionTile(
    scene: CreatePlayerProps['scene']
  ): Phaser.Tilemaps.Tile | null {
    const playerX = scene.player.sprite.x;
    const playerY = scene.player.sprite.y;

    const tile = scene.interactionLayer.getTileAtWorldXY(
      playerX,
      playerY,
      true
    );

    if ('interactionType' in tile.properties) {
      console.log(tile);
      return tile;
    }
    return null;
  }

  handleInteraction(
    tile: Phaser.Tilemaps.Tile,
    scene: CreatePlayerProps['scene']
  ) {
    const interactionType = (
      tile.properties as {
        interactionType: InteractionType;
      }
    ).interactionType;
    this.interactionText
      .setText(`Press E to interact for Task ${interactionType}`)
      .setPosition(
        scene.cameras.main.worldView.width / 2,
        scene.cameras.main.worldView.height / 2
      )
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setVisible(true);

    scene.input.keyboard?.on('keydown-E', () => {
      gameState.setInteractionModalOpen(true, interactionType);
    });
  }

  update({ scene }: UpdateProps) {
    const tile = this.checkInteractionTile(scene);

    if (tile) {
      this.handleInteraction(tile, scene);
    } else {
      this.interactionText.setAlpha(0);
    }
  }
}

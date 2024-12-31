import { useEffect, useRef } from 'react';

import Phaser from 'phaser';
import { GameScene } from '~/game/scenes';

export const GameContainer = () => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (gameContainerRef.current) {
      const mapWidth = 87;
      const mapHeight = 55;
      const config: Phaser.Types.Core.GameConfig = {
        width: mapWidth * 16,
        height: mapHeight * 16,
        type: Phaser.AUTO,
        scene: [
          new GameScene({ config: { mapSize: { x: mapWidth, y: mapHeight } } }),
        ],
        scale: {
          width: '100%',
          height: '100%',
        },
        parent: 'game-container',
        pixelArt: true,
        physics: {
          default: 'arcade',
          arcade: {
            debug: import.meta.env.MODE === 'development',
            gravity: { y: 0, x: 1 },
          },
        },
      };

      const phaserGame = new Phaser.Game(config);
      phaserGameRef.current = phaserGame;
    }

    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
      }
    };
  }, []);

  return <div ref={gameContainerRef} id='game-container' />;
};

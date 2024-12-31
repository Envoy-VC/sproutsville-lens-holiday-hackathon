import { GameScene } from '~/game/scenes';

export interface UpdateProps {
  scene: GameScene;
  time: number;
  delta: number;
}

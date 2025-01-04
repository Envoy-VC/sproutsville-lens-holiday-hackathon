import type { UpdateProps } from '~/types/game';

interface MinimapProps {
  scene: Phaser.Scene;
  map: Phaser.Tilemaps.Tilemap;
  toFollow: Phaser.GameObjects.GameObject;
  zoom?: number;
}

export class Minimap {
  public playerPointer: Phaser.GameObjects.Arc;
  public minimap: Phaser.Cameras.Scene2D.Camera;

  constructor({ scene, toFollow, zoom = 0.25 }: MinimapProps) {
    const minimapWidth = 300;
    const minimapHeight = 150;
    const minimapX = scene.cameras.main.width - minimapWidth - 10;
    const minimapY = 10;

    console.log({ minimapX, minimapY });

    const blackFrame = scene.add.graphics();
    blackFrame.fillStyle(0x000000, 1);
    blackFrame.fillRect(
      minimapX - 4,
      minimapY - 4,
      minimapWidth + 8,
      minimapHeight + 8
    );

    blackFrame.setDepth(0);

    // Add a white border around the minimap
    const border = scene.add.graphics();
    border.lineStyle(4, 0xffffff, 1); // White border with 4px thickness
    border.strokeRect(
      minimapX - 4,
      minimapY - 4,
      minimapWidth + 8,
      minimapHeight + 8
    ); // Draw rectangle for the border
    border.setDepth(1);

    // Create the minimap camera
    this.minimap = scene.cameras.add(
      minimapX,
      minimapY,
      minimapWidth,
      minimapHeight
    );

    this.minimap.setZoom(zoom);
    this.minimap.ignore(toFollow);
    this.minimap.setBackgroundColor(0x000000);

    this.playerPointer = scene.add.circle(0, 0, 20, 0xff0000).setDepth(3);
  }

  update({ scene }: UpdateProps) {
    const [playerX, playerY] = [scene.player.sprite.x, scene.player.sprite.y];

    const cameraBounds = {
      x: scene.map.widthInPixels * scene.cameras.main.zoom,
      y: scene.map.heightInPixels * scene.cameras.main.zoom,
    };

    const xLimit = scene.map.widthInPixels * 0.25 + 150;
    const yLimit = scene.map.heightInPixels * 0.25 + 160;

    const getMinimapScrollX = () => {
      if (playerX > xLimit) {
        if (playerX > cameraBounds.x - xLimit) {
          return cameraBounds.x - xLimit;
        }
        return playerX;
      }
      return xLimit;
    };

    const getMinimapScrollY = () => {
      if (playerY > yLimit) {
        if (playerY > cameraBounds.y - yLimit) {
          return cameraBounds.y - yLimit;
        }
        return playerY;
      }
      return yLimit;
    };

    const miniMapX = getMinimapScrollX();
    const miniMapY = getMinimapScrollY();

    this.minimap.setScroll(miniMapX, miniMapY);
    this.playerPointer.setPosition(
      scene.player.sprite.x,
      scene.player.sprite.y
    );
  }
}

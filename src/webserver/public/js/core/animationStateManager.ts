

import { updateLayeredAnimation } from './layeredAnimation.js';

export class AnimationStateManager {

  updateAllPlayers(players: Map<string, any>, deltaTime: number): void {
    players.forEach(player => {
      if (player.layeredAnimation) {
        updateLayeredAnimation(player.layeredAnimation, deltaTime);
      }
    });
  }

}

export const animationManager = new AnimationStateManager();
